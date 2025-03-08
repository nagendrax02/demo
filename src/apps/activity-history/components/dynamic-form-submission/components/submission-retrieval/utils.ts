import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import {
  IActivityField,
  ICapturedFromConfig,
  IField,
  INormalizedSubmissionRetrievalData,
  ISubmitRetrievalData,
  ITaskField
} from './submission-retrieval.types';
import { FORM_ENTITY } from '../../constants';
import { ActivityBaseAttributeDataType, DataType, RenderType } from 'common/types/entity/lead';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { getSubmissionStatusConfig } from './submission-status-utils';
import { EntityType } from 'common/types';

const Label = {
  Activity: 'Activity',
  Opportunity: 'Opportunity',
  Task: 'Task',
  Details: 'Details'
};

const getFormSubmissionData = async (submissionFormId: string): Promise<ISubmitRetrievalData> => {
  const response: ISubmitRetrievalData = await httpGet({
    path: `${API_ROUTES.retrieveSubmissionLog}${submissionFormId}`,
    module: Module.Marvin,
    callerSource: CallerSource.ActivityHistory
  });
  return response;
};

const getDataType = (
  dataType: DataType | ActivityBaseAttributeDataType,
  schemaName: string
): DataType => {
  if (schemaName === DataType.DueDate) {
    return DataType.DueDate;
  }

  if (dataType === DataType.Phone) {
    return DataType.Text;
  }
  if (dataType === DataType.Email) {
    return DataType.Text;
  }

  return dataType as DataType;
};

const SchemaName = 'Schema_Name';

const augmentCfsFields = (
  fields: IField[],
  parentSchemaName: string,
  entityId?: string
): IAugmentedAttributeFields[] => {
  if (!fields?.length) {
    return [];
  }

  return fields
    ?.map((field) => {
      const dataType = getDataType(field?.DataType, field?.SchemaName);
      return {
        id: field?.SchemaName,
        schemaName: field?.SchemaName?.replace(`${parentSchemaName}_`, ''),
        name: field?.DisplayName,
        value: field?.Value,
        fieldRenderType: dataType as unknown as RenderType,
        dataType: dataType,
        colSpan: 1,
        isCFSField: true,
        parentSchemaName: parentSchemaName,
        entityId: entityId,
        isActivity: true
      };
    })
    ?.filter((field) => {
      if (field?.schemaName !== SchemaName) {
        return field;
      }
    });
};

const fieldAugmentation = (field: IField, entityId?: string): IAugmentedAttributeFields => {
  const dataType = getDataType(field?.DataType, field?.SchemaName);
  const augmentedField = {
    id: field?.SchemaName,
    schemaName: field?.SchemaName,
    name: field?.DisplayName,
    value: field?.Value,
    fieldRenderType: dataType as unknown as RenderType,
    dataType: dataType,
    colSpan: 1,
    cfsFields: field?.SubFields
      ? augmentCfsFields(field?.SubFields, field?.SchemaName, entityId)
      : [],
    entityId: entityId,
    isActivity: true
  };

  if (field?.SchemaName === LEAD_SCHEMA_NAME.RELEATED_COMPANY_ID && field?.Value) {
    return {
      ...augmentedField,
      name: 'View Account',
      fieldRenderType: RenderType.Account
    };
  }

  return augmentedField;
};

const augmentFields = (fields: IField[], entityId?: string): IAugmentedAttributeFields[] => {
  if (!fields?.length) {
    return [];
  }

  return fields?.map((field) => {
    return fieldAugmentation(field, entityId);
  });
};

const augmentLeadFields = (leadFields: IField[]): IField[] => {
  return leadFields.map((leadField) => {
    if (leadField?.DataType === DataType.Phone || leadField?.DataType === DataType.Email) {
      return { ...leadField, DataType: DataType.Text };
    }
    if (leadField?.DataType === DataType.Date) {
      return { ...leadField, DataType: DataType.DateTime };
    }
    return leadField;
  });
};

const getCapturedFromValue = (oldValue: string): string => {
  const newCapturedFromValueMap: Record<string, string> = {
    platform: 'Old LeadSquared'
  };
  return newCapturedFromValueMap?.[oldValue?.toLowerCase()] ?? oldValue;
};

const getCapturedFromConfig = (data: ISubmitRetrievalData): ICapturedFromConfig | undefined => {
  if (data?.FormEntity?.CapturedFrom) {
    return {
      showIcon: data?.IsStatusEnabledInDFS,
      source: getCapturedFromValue(data?.FormEntity?.CapturedFrom)
    };
  }
  return undefined;
};

const getOpportunityAndActivity = ({
  name,
  type,
  fields,
  data
}: {
  name: string;
  type: string;
  fields: IActivityField[];
  data: ISubmitRetrievalData;
}): INormalizedSubmissionRetrievalData[] => {
  return fields?.map((field) => {
    return {
      title: `${name} - ${field && field.DisplayName} - ${Label.Details}`,
      fields: augmentFields(field?.Fields, field?.ActivityId),
      type: type,
      entityId: field?.ActivityId,
      submissionStatusConfig: getSubmissionStatusConfig({
        entityType:
          type === FORM_ENTITY.ACTIVITY_FIELDS ? EntityType.Activity : EntityType.Opportunity,
        isStatusEnabledInDFS: data?.IsStatusEnabledInDFS,
        data: field
      })
    };
  });
};

const getLeadFields = (
  leadFields: IField[],
  leadRepName: string,
  data: ISubmitRetrievalData
): INormalizedSubmissionRetrievalData => {
  return {
    title: `${leadRepName} ${Label.Details}`,
    fields: augmentFields(augmentLeadFields(leadFields)),
    type: FORM_ENTITY.LEAD_FIELDS,
    submissionStatusConfig: getSubmissionStatusConfig({
      entityType: EntityType.Lead,
      isStatusEnabledInDFS: data?.IsStatusEnabledInDFS,
      data,
      leadRepName
    })
  };
};

const getTask = (
  fields: ITaskField[],
  data: ISubmitRetrievalData
): INormalizedSubmissionRetrievalData[] => {
  return fields?.map((field) => {
    return {
      title: `${Label.Task} - ${field?.TaskTypeName || ''} - ${Label.Details}`,
      fields: augmentFields(field?.Fields),
      type: FORM_ENTITY.TASK_FIELDS,
      submissionStatusConfig: getSubmissionStatusConfig({
        entityType: EntityType.Task,
        isStatusEnabledInDFS: data?.IsStatusEnabledInDFS,
        data: field
      })
    };
  });
};

// eslint-disable-next-line max-lines-per-function
const getNormalizedSubmissionData = (
  data: ISubmitRetrievalData,
  leadRepName: string
): INormalizedSubmissionRetrievalData[] => {
  const normalizedSubmissionData: INormalizedSubmissionRetrievalData[] = [];
  const formEntity = data?.FormEntity;

  if (!formEntity) {
    return [];
  }
  const leadFields = formEntity?.LeadFields;
  const activityFields = formEntity?.ActivityFields;
  const opportunityFields = formEntity?.OpportunityFields;
  const taskFields = formEntity?.TaskFields;

  if (leadFields?.length) {
    normalizedSubmissionData.push(getLeadFields(leadFields, leadRepName, data));
  }

  if (activityFields?.length) {
    normalizedSubmissionData.push(
      ...getOpportunityAndActivity({
        name: Label.Activity,
        type: FORM_ENTITY.ACTIVITY_FIELDS,
        fields: activityFields,
        data: data
      })
    );
  }

  if (opportunityFields?.length) {
    normalizedSubmissionData.push(
      ...getOpportunityAndActivity({
        name: Label.Opportunity,
        type: FORM_ENTITY.OPPORTUNITY_FIELDS,
        fields: opportunityFields,
        data: data
      })
    );
  }

  if (taskFields?.length) {
    normalizedSubmissionData.push(...getTask(taskFields, data));
  }

  return normalizedSubmissionData;
};

export { getFormSubmissionData, getNormalizedSubmissionData, getCapturedFromConfig };
