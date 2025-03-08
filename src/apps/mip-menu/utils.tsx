import { trackError } from 'common/utils/experience/utils/track-error';
import { AuthKey } from 'common/utils/authentication/authentication.types';
import { getMiPPreReqData, safeParseJson } from 'common/utils/helpers/helpers';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IHeader } from './header.types';
import ItemLink from './components/ItemLink';
import ProfileOption from './components/ProfileOption';
import CheckinCheckout from './components/checkin-checkout';
import AvailablePhones from './components/checkin-checkout/AssociatedPhones';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IStatus } from './components/checkin-checkout/checkin-checkout.types';
import AvailableStatus from './components/checkin-checkout/AvailableStatus';
import { IAuthenticationConfig } from 'common/types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { ICICOStatusConfig } from '../header/header.types';
import { STATUS_INFO } from '../header/components/profile/constants';
import { NAV_MENU_PARENT_ID } from './components/constants';

const sortData = (items: IHeader[]): IHeader[] => items.sort((a, b) => a.SortOrder - b.SortOrder);

// ToDo: api is giving group number instead of name and this needs to be fixed in api
// https://leadsquared.atlassian.net/browse/SW-5588
const HeaderGroups = {
  ['1']: 'InnerTopMenu',
  ['2']: 'PostLoginMenu',
  ['7']: 'HelpMenu'
};

export const augmentHeaderData = ({
  header
}: {
  header?: IHeader[];
}): Record<string, IHeader[]> => {
  const mipData = getMiPPreReqData();
  const menuConfig = header?.length
    ? header
    : (safeParseJson(mipData?.[AuthKey.MipMenu] ?? '') as IHeader[]);
  const augmentedData =
    menuConfig?.reduce((acc: Record<string, IHeader[]>, item) => {
      if (item.Path === 'manageusers') {
        item.ActionName = item.ActionName + '?openInFullPage=true';
      }
      if (typeof item.Group === 'number') {
        const group = HeaderGroups[item.Group];
        if (acc[group]) {
          acc[group] = [...acc[group], item];
        } else {
          acc[group] = [item];
        }
      } else {
        if (acc[item.Group]) {
          acc[item.Group] = [...acc[item.Group], item];
        } else {
          acc[item.Group] = [item];
        }
      }
      return acc;
    }, {}) || {};

  Object.keys(augmentedData).forEach((key) => {
    augmentedData[key] = sortData(augmentedData[key]);
  });

  return augmentedData;
};

const handleEntityRepName = (item: IHeader, updatedValue: string): string => {
  if (item?.Id === NAV_MENU_PARENT_ID.Opportunity) {
    return `Manage ${getMiPPreReqData()?.[AuthKey.OppPluralName] || 'Opportunities'}`;
  }

  return updatedValue;
};

export const replaceRepName = (item: IHeader, leadRepName: IEntityRepresentationName): string => {
  const value = item?.Caption;
  let updatedVal = value;
  if (value?.includes('Leads') && leadRepName?.PluralName && value !== leadRepName.PluralName) {
    updatedVal = value.replaceAll('Leads', leadRepName.PluralName);
  } else if (
    value?.includes('Lead') &&
    leadRepName?.SingularName &&
    value !== leadRepName.SingularName
  ) {
    updatedVal = value.replaceAll('Lead', leadRepName.SingularName);
  }

  updatedVal = handleEntityRepName(item, updatedVal);
  return updatedVal;
};

export const augmentMenuItem = ({
  items,
  leadRepName,
  getCustomOption,
  showModal
}: {
  items: IHeader[];
  leadRepName: IEntityRepresentationName;
  showModal?: (show: boolean) => void;
  getCustomOption?: (item: IHeader) => JSX.Element;
}): IMenuItem[] => {
  return (
    items?.map((item) => ({
      ...item,
      label: replaceRepName(item, leadRepName),
      value: item.Id + item.ControllerName,
      customComponent: (
        <ItemLink item={item} hasSubMenu showModal={showModal}>
          {getCustomOption?.(item)}
        </ItemLink>
      ),
      subMenu: item.Children
        ? augmentMenuItem({ items: item.Children, leadRepName, getCustomOption })
        : undefined
    })) || []
  );
};

export const getUserDetails = (): Record<string, string> => {
  const mipData = getMiPPreReqData();
  const name = mipData?.[AuthKey.UserName] as string;
  const email = mipData?.[AuthKey.UserEmail] as string;
  const tenant = mipData?.[AuthKey.DisplayName] as string;
  const image = mipData?.[AuthKey.ProfileImg] as string;

  return {
    name,
    email,
    tenant,
    image
  };
};

export const getCICOConf = (): Record<string, string> => {
  const mipData = getMiPPreReqData();
  const CICOConf = mipData?.[AuthKey.Configuration] as string;
  const { CICOConfiguration } = (safeParseJson(CICOConf) || {}) as {
    CICOConfiguration: Record<string, string>;
  };
  return (CICOConfiguration || {}) as Record<string, string>;
};

export const getIsCheckInCheckoutEnabled = (): boolean => {
  const CICOConfiguration = getCICOConf();
  const isCheckInCheckoutEnabled = CICOConfiguration?.IsCheckInEnabled === 'True';
  return isCheckInCheckoutEnabled;
};

export const getAssociatedPN = (phoneNumbers: string): IMenuItem[] => {
  try {
    if (typeof phoneNumbers !== 'string' || !phoneNumbers?.trim?.()) {
      return [];
    }
    return (
      phoneNumbers.split(',')?.map((item) => ({
        label: item,
        value: item,
        customComponent: (
          <AvailablePhones item={{ label: item, value: item }} allNumbers={phoneNumbers} />
        )
      })) || []
    );
  } catch (err) {
    err.message = `-- ${phoneNumbers} -- ${err.message}`;
    trackError(err);
    return [];
  }
};

export const getCompanyLogo = (): string => {
  const mipData = getMiPPreReqData();
  const logoUrl = mipData?.[AuthKey.CompanyLogo] as string;
  return logoUrl;
};

export const profileOption: IMenuItem = {
  label: '',
  value: 'profile',
  customComponent: <ProfileOption />
};

export const checkoutOption: IMenuItem = {
  label: '',
  value: 'checkout',
  disableMenuCloseOnClick: true,
  customComponent: <CheckinCheckout />
};

export const getStatusList = (isCheckedIn: boolean): IStatus[] => {
  const statusConfig = getCICOConf().CICOStatusConfiguration;
  if (statusConfig) {
    const parsedConfig = safeParseJson(statusConfig) as Record<string, IStatus[]>;
    return isCheckedIn ? parsedConfig.CheckedInStatusList : parsedConfig.CheckedOutStatusList;
  }
  return [];
};

const getStatusMenuOptions = (statusList: IStatus[]): IMenuItem[] => {
  return statusList.map((item) => ({
    label: item.Name,
    value: item.Color,
    customComponent: <AvailableStatus item={item} />
  }));
};

export const getProfileActions = ({
  loginItems,
  getCustomOption,
  isCheckedIn,
  availablePhone,
  leadRepName,
  showModal
}: {
  loginItems: IHeader[];
  getCustomOption?: (item: IHeader) => JSX.Element;
  isCheckedIn: boolean;
  leadRepName: IEntityRepresentationName;
  showModal: (show: boolean) => void;
  availablePhone: string;
}): IMenuItem[] => {
  const actions = [
    ...augmentMenuItem({ items: loginItems, leadRepName, getCustomOption, showModal })
  ];
  const associatedPhones = getAssociatedPN(availablePhone);
  const CICOConfig = getCICOConf();
  if (CICOConfig?.IsCheckInEnabled === 'True') {
    actions.unshift(checkoutOption);
    const statusList = getStatusList(!!isCheckedIn);
    const availableStatus: IMenuItem = {
      ...getStatusMenuOptions(statusList)[0],
      customComponent: <AvailableStatus />,
      subMenu: getStatusMenuOptions(statusList)
    };
    actions.unshift(availableStatus);
    if (associatedPhones.length) {
      const availablePhones: IMenuItem = {
        ...getAssociatedPN(availablePhone)[0],
        customComponent: <AvailablePhones item={getAssociatedPN(availablePhone)[0]} />,
        subMenu: getAssociatedPN(availablePhone)
      };
      actions.unshift(availablePhones);
    }
  }
  actions.unshift(profileOption);
  return actions;
};

export const getUrl = (item: IHeader): string => {
  if (item?.Path === 'signout') {
    return '#';
  }
  if (!item?.ControllerName) {
    return item?.ActionName;
  }
  const { ControllerName, ActionName, RelatedConnectorId, CustomApplicationMenuId } = item;
  let url = '/' + ControllerName;
  if (ActionName) url += '/' + ActionName;
  if (RelatedConnectorId) url += '/' + RelatedConnectorId;
  if (CustomApplicationMenuId) url += '/' + CustomApplicationMenuId;
  return url;
};

export const getSelectedStatus = (isCheckedIn: boolean): IStatus | object => {
  try {
    const tenantDetails = (getItem(StorageKey.Auth) as IAuthenticationConfig)?.Tenant;

    const CICOStatusConfig =
      (safeParseJson(tenantDetails?.CICOStatusConfiguration || '') as ICICOStatusConfig) ||
      STATUS_INFO;

    return isCheckedIn
      ? CICOStatusConfig?.CheckedInStatusList[0]
      : CICOStatusConfig?.CheckedOutStatusList[0];
  } catch (error) {
    console.log(error);
  }
  return {};
};
