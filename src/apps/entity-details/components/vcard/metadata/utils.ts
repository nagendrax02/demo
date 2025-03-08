import { LEAD_SCHEMA_NAME } from '../../../schema-names';
import { IMetaDataConfig } from '../../../types';

const getMetaDataTitle = (field: IMetaDataConfig): string | undefined => {
  switch (field.SchemaName) {
    case LEAD_SCHEMA_NAME.ADDRESS:
      return undefined;
    case LEAD_SCHEMA_NAME.JOB_TITLE:
    case LEAD_SCHEMA_NAME.COMPANY:
    case LEAD_SCHEMA_NAME.EMAIL_ADDRESS:
    case LEAD_SCHEMA_NAME.MOBILE:
    case LEAD_SCHEMA_NAME.PHONE:
      return field?.Value;
    default:
      return field?.DisplayName;
  }
};

export { getMetaDataTitle };
