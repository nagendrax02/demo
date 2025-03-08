import { IEntity } from 'common/types';
import {
  DEPRECATED_SOCIAL_MEDIA_ICONS,
  LEAD_ADDRESS_SCHEMA_NAMES,
  LEAD_SECONDARY_SCHEMA_NAMES,
  LEAD_VCARD_METADATA_DISPLAY_NAMES,
  META_DATA_FIELD_ORDER,
  SOCIAL_MEDIA_ICONS,
  VCARD_PROPERTIES
} from '../../../constants';
import { IMetaDataConfig } from '../../../types';
import { DataType, ILead, RenderType } from 'common/types/entity/lead';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { getDisplayOrder } from './vcard';

const getAccountInfo = (entityData: IEntity): Record<string, string> => {
  const metaData = entityData?.details?.Fields;

  return {
    accountId: `${metaData?.[LEAD_SCHEMA_NAME.RELEATED_COMPANY_ID] || ''}`,
    accountName: `${metaData?.[LEAD_SCHEMA_NAME.RELATED_COMPANY_ID_NAME] || ''}`
  };
};

const augmentAssociatedAccount = (
  entityData: IEntity,
  augmentedData: IMetaDataConfig[]
): IMetaDataConfig[] => {
  const accountInfo = getAccountInfo(entityData);

  if (!accountInfo?.accountId) {
    return augmentedData;
  }

  const accountAugmentedData = [...augmentedData];

  accountAugmentedData.unshift({
    DisplayName: accountInfo?.accountName,
    SchemaName: LEAD_SCHEMA_NAME.RELEATED_COMPANY_ID,
    Value: accountInfo?.accountId,
    DataType: DataType.Text,
    RenderType: RenderType.AccountName
  });

  return accountAugmentedData;
};

const augmentSocialMediaIcons = (augmentedData: IMetaDataConfig[]): IMetaDataConfig[] => {
  const filteredData: IMetaDataConfig[] = augmentedData.filter(
    (field) =>
      !SOCIAL_MEDIA_ICONS.includes(field?.SchemaName) &&
      !DEPRECATED_SOCIAL_MEDIA_ICONS.includes(field?.SchemaName)
  );
  const iconData: IMetaDataConfig[] = [];
  augmentedData.forEach((field) => {
    if (
      SOCIAL_MEDIA_ICONS.includes(field.SchemaName) &&
      !DEPRECATED_SOCIAL_MEDIA_ICONS.includes(field?.SchemaName)
    ) {
      iconData.push({
        ...field,
        RenderType: RenderType.SocialMedia,
        hideSeperator: true
      });
    }
  });

  return [...filteredData, ...iconData];
};

const getCombinedAddress = (entityData: IEntity): string => {
  const metaData = entityData?.details?.Fields;

  const city = metaData?.[LEAD_SCHEMA_NAME.MX_CITY];
  const state = metaData?.[LEAD_SCHEMA_NAME.MX_STATE];
  const country = metaData?.[LEAD_SCHEMA_NAME.MX_COUNTRY];

  const address = [city, state, country].filter(Boolean).join(', ');

  return address;
};

const augmentLeadAddress = (
  entityData: IEntity,
  augmentedData: IMetaDataConfig[]
): IMetaDataConfig[] => {
  const combinedAddress = getCombinedAddress(entityData);
  if (!combinedAddress) {
    return augmentedData;
  }

  const addressAugmentedData = augmentedData.filter(
    (field) => !LEAD_ADDRESS_SCHEMA_NAMES.includes(field?.SchemaName)
  );

  addressAugmentedData.push({
    DisplayName: LEAD_SCHEMA_NAME.ADDRESS,
    SchemaName: LEAD_SCHEMA_NAME.ADDRESS,
    Value: combinedAddress,
    DataType: DataType.Text,
    RenderType: RenderType.Textbox,
    displayOrder: META_DATA_FIELD_ORDER[LEAD_SCHEMA_NAME.ADDRESS]
  });

  return addressAugmentedData;
};

const augmentDisplayName = (augmentedData: IMetaDataConfig[]): IMetaDataConfig[] => {
  const displayNameAugmentedData: IMetaDataConfig[] = [];

  augmentedData.forEach((field) => {
    if (LEAD_VCARD_METADATA_DISPLAY_NAMES?.[field?.SchemaName]) {
      displayNameAugmentedData.push({
        ...field,
        vCardDisplayName: LEAD_VCARD_METADATA_DISPLAY_NAMES?.[field?.SchemaName]?.displayName,
        RenderType: LEAD_VCARD_METADATA_DISPLAY_NAMES?.[field?.SchemaName]?.renderType
      });
    } else {
      displayNameAugmentedData.push(field);
    }
  });
  return displayNameAugmentedData;
};

const getAugmentedMetaData = (entityData: ILead): IMetaDataConfig[] => {
  let augmentedMetaData: IMetaDataConfig[] = [];
  const metaData = entityData?.details?.Fields;

  const vCardFields = entityData?.details?.VCardConfiguration?.Sections?.find(
    (section) => section.DisplayName === VCARD_PROPERTIES
  )?.Fields;

  vCardFields?.forEach((field) => {
    const fieldConfig = entityData?.metaData?.Fields?.find((config) => {
      return config?.SchemaName === field?.SchemaName;
    });
    const fieldValue = metaData?.[field?.SchemaName];

    if (fieldConfig && fieldValue && LEAD_SECONDARY_SCHEMA_NAMES.includes(fieldConfig.SchemaName)) {
      augmentedMetaData.push({
        ...fieldConfig,
        Value: fieldValue,
        onClick: () => {},
        displayOrder: getDisplayOrder(fieldConfig.SchemaName)
      });
    }
  });

  // Combines city, state and country fields
  augmentedMetaData = augmentLeadAddress(entityData, augmentedMetaData);

  // Add display name for phone and mobile fields to be shown in vCard
  augmentedMetaData = augmentDisplayName(augmentedMetaData);

  // Add social media icons data
  augmentedMetaData = augmentSocialMediaIcons(augmentedMetaData);

  // Add associated account
  augmentedMetaData = augmentAssociatedAccount(entityData, augmentedMetaData);

  augmentedMetaData = augmentedMetaData.sort((a, b) => {
    if ((a?.displayOrder || 0) > (b?.displayOrder || 0)) {
      return 1;
    } else if ((a?.displayOrder || 0) < (b?.displayOrder || 0)) {
      return -1;
    } else {
      return 0;
    }
  });

  return augmentedMetaData;
};

export { getAugmentedMetaData };
