import { trackError } from 'common/utils/experience/utils/track-error';
import { userDataManager } from 'common/utils/entity-data-manager';
import { IGroupedOption } from '../../../../common/component-lib/grouped-option-dropdown';
import { IUserOption } from 'common/types';
import { LEAD_SHARE_GROUP } from './constants';
import { getEntityId } from 'common/utils/helpers';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { Type, INotification } from '@lsq/nextgen-preact/notification/notification.types';

export const fetchOptions = async (
  callerSource: CallerSource,
  searchText?: string
): Promise<IGroupedOption[]> => {
  try {
    const options: IGroupedOption[] = [];
    const response = (await userDataManager.getDropdownOptions({
      searchText: searchText || '',
      callerSource
    })) as IUserOption[];

    response?.map((user) => {
      options.push({
        label: user.label || '',
        value: user.value || '',
        secondaryLabel: user.text || '',
        group: LEAD_SHARE_GROUP
      });
    });

    return options;
  } catch (error) {
    trackError(error);
    return [];
  }
};

export const getRecipientEmailAddress = (users: IGroupedOption[]): string => {
  try {
    if (users && users?.length) {
      let formatted = '';
      users?.forEach((user) => {
        formatted += `${user?.label} <${user?.secondaryLabel}>;`;
      });
      return formatted;
    }
  } catch (error) {
    trackError('failed to get recipent email address', error);
  }
  return '';
};

// eslint-disable-next-line max-lines-per-function
export const handleSave = async (config: {
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  showAlert: (notification: INotification) => void;
  selectedUsers: IGroupedOption[];
  message: string;
  entityId?: string;
  representationName: string;
}): Promise<void> => {
  const { setIsLoading, showAlert, selectedUsers, message, representationName, entityId } = config;
  try {
    setIsLoading(true);
    const body = {
      LeadId: entityId ?? getEntityId(),
      Notes: message,
      RecipientEmailAddress: getRecipientEmailAddress(selectedUsers)
    };
    const response = (await httpPost({
      path: API_ROUTES.leadShare,
      module: Module.Marvin,
      body,
      callerSource: CallerSource.LeadDetailsVCard
    })) as { Status: string };
    if (response?.Status === 'Success') {
      showAlert({
        type: Type.SUCCESS,
        message: `${representationName} shared via email successfully`
      });
    } else {
      showAlert({
        type: Type.ERROR,
        message: 'Unable to share lead'
      });
    }
  } catch (error) {
    showAlert({
      type: Type.ERROR,
      message: 'Unable to share lead'
    });
  }
  setIsLoading(false);
};

export const getDefaultSelectedUser = (
  leadFields: Record<string, string | null> | undefined
): IGroupedOption[] => {
  const userId = leadFields?.OwnerId || '';
  const userEmail = leadFields?.OwnerIdEmailAddress || leadFields?.POwnerEmail || '';
  const userName = leadFields?.OwnerIdName || '';

  return [
    {
      label: userName,
      value: userId,
      secondaryLabel: userEmail,
      group: LEAD_SHARE_GROUP
    }
  ];
};
