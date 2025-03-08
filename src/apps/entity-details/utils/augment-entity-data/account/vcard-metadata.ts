import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { IAccount } from 'common/types';
import {
  ACCOUNT_SCHEMA_NAME,
  EXCLUDE_ACCOUNT_SCHEMA_NAME,
  META_DATA_FIELD_ORDER,
  TOP_SECTION
} from '../../../constants';
import { IMetaDataConfig } from '../../../types';
import { DataType, RenderType } from 'common/types/entity/lead';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { getDisplayOrder } from './vcard';
import {
  IAccountAttribute,
  IAccountMetaData,
  IAugmentedMetaData
} from 'common/types/entity/account/metadata.types';
import { IField } from 'common/types/entity/account/details.types';
import { SOCIAL_MEDIA_SCHEMA_MAPPING } from 'apps/entity-details/types/entity-data.types';

const getAddressDetails = (data: IAccountMetaData): string => {
  const { CITY, STATE, COUNTRY } = ACCOUNT_SCHEMA_NAME;
  const city = data?.[CITY] as string;
  const state = data?.[STATE] as string;
  const country = data?.[COUNTRY] as string;

  const address = [city, state, country].filter(Boolean);

  return address.join(', ');
};

export const getMetaDataDictionary = (
  metaData: IAccountAttribute[]
): Record<string, IAugmentedMetaData> => {
  try {
    const allEntityAttr: Record<string, IAugmentedMetaData> = {};
    metaData?.forEach((item) => {
      allEntityAttr[item?.SchemaName] = {
        RenderType: item?.RenderType,
        DataType: item?.DataType,
        DisplayName: item?.DisplayName
      };
    });

    return allEntityAttr;
  } catch (error) {
    trackError(error);
  }
  return {};
};

const getRenderType = (
  metaDataDictionary: Record<string, IAugmentedMetaData>,
  field: IField
): RenderType => {
  let type = metaDataDictionary[field?.SchemaName]?.RenderType;
  //converting to render icon
  if (type === 'URL' && field?.SchemaName !== 'Website') type = RenderType.SocialMedia;
  else if (type === 'Phone' || type === 'Email') type = RenderType.Text;
  return type;
};

const getAugmentedMetaData = (entityData: IAccount): IMetaDataConfig[] => {
  const augmentedMetaData: IMetaDataConfig[] = [];
  const metaData = entityData?.details?.Fields;

  const metaDataDictionary = getMetaDataDictionary(
    (entityData?.metaData?.Fields || []) as IAccountAttribute[]
  );

  const accountDetails = entityData?.details?.VCardConfiguration?.Sections?.find(
    (section) => section.Name === TOP_SECTION
  )?.Fields;

  accountDetails?.forEach((field) => {
    if (metaDataDictionary[field?.SchemaName]) {
      if (
        !(field?.SchemaName.toUpperCase() in ACCOUNT_SCHEMA_NAME) &&
        !(field?.SchemaName?.toUpperCase() in EXCLUDE_ACCOUNT_SCHEMA_NAME)
      ) {
        augmentedMetaData?.push({
          SchemaName:
            (SOCIAL_MEDIA_SCHEMA_MAPPING[field?.SchemaName?.toLowerCase()] as string) ||
            field?.SchemaName,
          Value: metaData?.[field?.SchemaName] || '',
          DataType: metaDataDictionary[field?.SchemaName]?.DataType,
          RenderType: getRenderType(metaDataDictionary, field),
          DisplayName: metaDataDictionary[field?.SchemaName]?.DisplayName,
          onClick: () => {},
          displayOrder: getDisplayOrder(field.SchemaName)
        });
      }
    }
  });

  const augmentedAddressDetail = getAddressDetails(metaData as IAccountMetaData);
  const addressDetails = {
    Value: augmentedAddressDetail,
    SchemaName: ACCOUNT_SCHEMA_NAME?.CITY,
    DisplayName: ACCOUNT_SCHEMA_NAME?.CITY,
    DataType: DataType.Text,
    RenderType: RenderType.Textbox,
    displayOrder: META_DATA_FIELD_ORDER[LEAD_SCHEMA_NAME.ADDRESS]
  };
  if (addressDetails.Value) augmentedMetaData?.push(addressDetails);

  return augmentedMetaData;
};

export { getAugmentedMetaData };
