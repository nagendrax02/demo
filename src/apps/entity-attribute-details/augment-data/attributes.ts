import { trackError } from 'common/utils/experience/utils/track-error';
import {
  DataType,
  ICustomObjectAttribute,
  ILeadAttribute,
  ILeadDetailsConfiguration,
  ILeadMetaData,
  RenderType
} from 'common/types/entity/lead';
import {
  IAugmentedAttributeFields,
  IAugmentedAttributes,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { createHashMapFromArray, safeParseJson } from 'common/utils/helpers/helpers';
import { getAugmentedFieldRenderType } from 'apps/entity-details/utils/augment-entity-data/lead/properties';
import { MASKED_TEXT } from 'common/constants';
import { EntityAttributeType } from 'common/types/entity/lead/metadata.types';
import { IAttributeDetailsConfiguration } from 'common/types/entity/account/details.types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { EntityType } from 'common/types';

type IField = Record<string, string | null>;
interface IAttributeField {
  DisplayName: string;
  SchemaName: string;
  ColSpan: string;
  Fields: IAttributeField[];
}

const SchemaName = 'SchemaName';

interface IGetAugmentedCfsFields {
  cfsAttributeFields: IAttributeField[];
  fields: IField | null;
  cfsFieldsMetadata: ICustomObjectAttribute[] | undefined;
  parentFieldMetaData: ILeadAttribute;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

const getRenderType = ({
  fieldValue,
  attributeField,
  metaData,
  entityType,
  tabId
}: {
  fieldValue: string;
  attributeField: IAttributeField;
  metaData: Record<string, ILeadAttribute>;
  entityType?: EntityType;
  tabId?: string;
}): RenderType => {
  return fieldValue === MASKED_TEXT
    ? RenderType.Text
    : getAugmentedFieldRenderType({
        field: attributeField,
        leadAugmentedMetaData: metaData,
        entityType,
        tabId
      });
};

const getAugmentedCfsFieldProperties = ({
  fieldValue,
  cfsAttributeField,
  cfsMetadata,
  renderType,
  entityDetailsCoreData,
  parentFieldMetaData
}: {
  fieldValue: string;
  cfsAttributeField: IAttributeField;
  cfsMetadata: ICustomObjectAttribute;
  renderType: RenderType;
  entityDetailsCoreData?: IEntityDetailsCoreData;
  parentFieldMetaData: ILeadAttribute;
}): IAugmentedAttributeFields => {
  return {
    id: cfsAttributeField?.SchemaName,
    name: cfsMetadata?.DisplayName || cfsAttributeField?.DisplayName,
    schemaName: cfsAttributeField?.SchemaName,
    value: fieldValue,
    fieldRenderType: renderType || cfsMetadata?.DataType,
    dataType: cfsMetadata?.DataType,
    colSpan: Number(cfsAttributeField?.ColSpan) || 1,
    isMatched: false,
    isActivity: !!entityDetailsCoreData?.entityIds?.opportunity,
    entityId: entityDetailsCoreData?.entityIds?.opportunity,
    leadId: entityDetailsCoreData?.entityIds?.lead,
    showAll: parentFieldMetaData?.showAll,
    removeDownloadOption: parentFieldMetaData?.removeDownloadOption
  };
};

const getAugmentedCfsFields = ({
  cfsAttributeFields,
  fields,
  cfsFieldsMetadata,
  parentFieldMetaData,
  entityDetailsCoreData
}: IGetAugmentedCfsFields): IAugmentedAttributeFields[] => {
  if (!cfsAttributeFields?.length || !cfsFieldsMetadata?.length) {
    return [];
  }

  try {
    const cfsMetadataHashMap = createHashMapFromArray(cfsFieldsMetadata || [], SchemaName);
    return cfsAttributeFields?.map((cfsAttributeField) => {
      const cfsMetadata = cfsMetadataHashMap[cfsAttributeField?.SchemaName];
      const fieldValue = fields?.[cfsAttributeField?.SchemaName || ''] || '';
      const renderType =
        fieldValue === MASKED_TEXT
          ? RenderType.Text
          : getAugmentedFieldRenderType({
              field: cfsAttributeField,
              leadAugmentedMetaData: cfsMetadataHashMap,
              entityType: entityDetailsCoreData?.entityDetailsType
            });

      return getAugmentedCfsFieldProperties({
        fieldValue,
        cfsAttributeField,
        cfsMetadata,
        renderType,
        entityDetailsCoreData,
        parentFieldMetaData
      });
    });
  } catch (error) {
    trackError(error);
    return [];
  }
};

const getName = ({
  fields,
  fieldMetadata,
  attributeField
}: {
  fields: IField | undefined;
  fieldMetadata: ILeadAttribute;
  attributeField: IAttributeField;
}): string => {
  if (attributeField?.SchemaName === 'RelatedCompanyId')
    return fields?.[LEAD_SCHEMA_NAME.RELATED_COMPANY_ID_NAME] || '';
  return fieldMetadata?.DisplayName || attributeField?.DisplayName;
};

interface IGetAugmentedAttributeFields {
  attributeFields: IAttributeField[];
  fields: IField | undefined;
  metaData: Record<string, ILeadAttribute>;
  entityDetailsCoreData?: IEntityDetailsCoreData;
  tabId?: string;
}

const getValidAttributeFields = (attributeFields: IAttributeField[]): IAttributeField[] => {
  const deprecatedSchemaNames = ['GTalkId', 'GooglePlusId'];
  return attributeFields.filter((field) => !deprecatedSchemaNames?.includes(field?.SchemaName));
};

interface IGetAugmentedFieldProperties {
  fieldMetadata: ILeadAttribute;
  renderType: RenderType;
  fieldValue: string;
  attributeField: IAttributeField;
  entityDetailsCoreData: IEntityDetailsCoreData | undefined;
  fields: IField | undefined;
}

const getAugmentedFieldProperties = ({
  fieldMetadata,
  renderType,
  fieldValue,
  attributeField,
  entityDetailsCoreData,
  fields
}: IGetAugmentedFieldProperties): IAugmentedAttributeFields => {
  return {
    id: attributeField?.SchemaName,
    schemaName: attributeField?.SchemaName,
    name: getName({
      fields: fields,
      fieldMetadata: fieldMetadata,
      attributeField: attributeField
    }),

    value: fieldValue,
    fieldRenderType: renderType,
    dataType: fieldMetadata?.DataType,
    colSpan: Number(attributeField?.ColSpan) || 1,
    entityAttributeType: fieldMetadata?.EntityAttributeType as EntityAttributeType,
    cfsFields:
      fieldMetadata?.DataType === DataType.CustomObject
        ? getAugmentedCfsFields({
            cfsAttributeFields: attributeField?.Fields,
            fields: safeParseJson(fieldValue || ''),
            cfsFieldsMetadata: fieldMetadata?.CustomObjectMetaData?.Fields,
            parentFieldMetaData: fieldMetadata,
            entityDetailsCoreData
          })
        : [],
    isMatched: false,
    entityId: fieldMetadata?.entityId,
    leadId: entityDetailsCoreData?.entityIds?.lead,
    additionalData: fieldMetadata?.additionalData,
    isActivity: !!entityDetailsCoreData?.entityIds?.opportunity,
    removeDownloadOption: fieldMetadata?.removeDownloadOption
  };
};

// eslint-disable-next-line max-lines-per-function
const getAugmentedAttributeFields = ({
  attributeFields,
  fields,
  metaData,
  entityDetailsCoreData,
  tabId
}: IGetAugmentedAttributeFields): IAugmentedAttributeFields[] => {
  if (!attributeFields?.length || !metaData) {
    return [];
  }
  try {
    const validAttributeFields = getValidAttributeFields(attributeFields);
    // eslint-disable-next-line complexity
    return validAttributeFields?.map((attributeField) => {
      const fieldMetadata = metaData?.[attributeField?.SchemaName || ''];
      const fieldValue = fields?.[attributeField?.SchemaName || ''] || '';
      const renderType = getRenderType({
        fieldValue,
        attributeField,
        metaData,
        tabId,
        entityType: entityDetailsCoreData?.entityDetailsType
      });

      return getAugmentedFieldProperties({
        fieldMetadata,
        attributeField,
        entityDetailsCoreData,
        fields,
        renderType,
        fieldValue
      });
    });
  } catch (error) {
    trackError(error);
    return [];
  }
};

interface IAugmentedAttributesData {
  attributes: ILeadDetailsConfiguration | IAttributeDetailsConfiguration | undefined;
  fields: IField | undefined;
  metaData: ILeadMetaData | undefined;
  leadRepName?: string;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

const getAugmentedAttributes = (data: IAugmentedAttributesData): IAugmentedAttributes[] => {
  const { attributes, fields, metaData, leadRepName, entityDetailsCoreData } = data;

  if (!attributes || !metaData) {
    return [];
  }
  try {
    const metadataHashMap = createHashMapFromArray(
      metaData?.Fields as ILeadAttribute[],
      SchemaName
    );
    const augmentedAttributes = attributes?.Sections?.map((attribute) => {
      return {
        id: (attribute?.Name || '') as string,
        name: (leadRepName
          ? attribute?.DisplayName?.replace('Lead', leadRepName) ||
            attribute?.Name?.replace('Lead', leadRepName)
          : attribute?.DisplayName) as string,
        fields: getAugmentedAttributeFields({
          attributeFields: attribute?.Fields as IAttributeField[],
          fields,
          metaData: metadataHashMap,
          entityDetailsCoreData,
          tabId: entityDetailsCoreData?.tabId
        })
      };
    });
    return augmentedAttributes;
  } catch (error) {
    trackError(error);
    return [];
  }
};

export { getAugmentedAttributes };
