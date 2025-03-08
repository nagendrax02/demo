import { CallerSource } from 'common/utils/rest-client';
import {
  fetchMetaData,
  fetchRepresentationName
} from 'common/utils/entity-data-manager/lead/metadata';
import fetchTaskMetaData from 'common/utils/entity-data-manager/task';
import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead';
import {
  DISPLAY_NAME,
  GROUPS,
  SCHEMA_NAMES,
  leadSchemaNamePrefix
} from '../../constants/constants';
import { ILeadMetadataMap } from 'common/types/entity/lead/metadata.types';
import {
  FieldsToChangeDisplayName,
  NotRequiredSchemas,
  RedundentLeadSchemaNames
} from './constants';
import {
  ITaskAttribute,
  ITaskMetadata,
  TaskAttributeDataType,
  TaskAttributeRenderType
} from 'common/types/entity/task/metadata.types';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import { getIsAccountEnabled } from 'common/utils/helpers/settings-enabled';
import {
  getFilteredLeadMetadataForNonLeadTab,
  replaceWithLeadRepresentationName,
  getStringifiedLeadType
} from '../common-utilities/utils';
import {
  getOpportunityRepresentationName,
  getSettingConfig,
  settingKeys
} from 'common/utils/helpers';
import { ASSOCIATED_TO } from '../common-utilities/constant';

export interface IAugmentedTaskMetaData {
  schemaName: string;
  displayName: string;
  renderType: TaskAttributeRenderType;
  dataType?: TaskAttributeDataType;
  parentField?: string;
  isSortable?: boolean;
  isLocationEnabled?: boolean;
}

export type IAugmentedMetaDataForTasks = IAugmentedSmartViewEntityMetadata | IAugmentedTaskMetaData;

const customFormedLeadMetadata = (
  representationName: string
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return {
    ['P_OwnerIdName']: {
      displayName: replaceWithLeadRepresentationName('Lead Owner', representationName),
      schemaName: `P_OwnerIdName`,
      dataType: DataType.Text,
      renderType: RenderType.Textbox
    },
    ['P_OwnerId']: {
      displayName: replaceWithLeadRepresentationName('Lead Owner', representationName),
      schemaName: `P_OwnerId`,
      dataType: DataType.Text,
      renderType: RenderType.Textbox,
      isSortable: true
    },
    ['P_ProspectActivityDate_Max']: {
      displayName: 'Last Activity Date',
      schemaName: 'P_ProspectActivityDate_Max',
      dataType: DataType.Date,
      renderType: RenderType.DateTime
    },
    ['P_CompanyTypeName']: {
      displayName: 'Account Type',
      schemaName: 'P_CompanyTypeName',
      dataType: DataType.Url,
      renderType: RenderType.URL
    },
    ['P_ProspectActivityName_Max']: {
      displayName: 'Last Activity',
      schemaName: 'P_ProspectActivityName_Max',
      dataType: DataType.Text,
      renderType: RenderType.Textbox
    }
  };
};

const customFormedTaskMetadata = {
  StatusCode: {
    displayName: 'Status',
    schemaName: 'StatusCode',
    dataType: TaskAttributeDataType.Text,
    renderType: TaskAttributeRenderType.Textbox,
    isSortable: false
  },
  UserTaskAutoId: {
    displayName: 'Task Id',
    schemaName: 'UserTaskAutoId',
    dataType: TaskAttributeDataType.Text,
    renderType: TaskAttributeRenderType.Textbox,
    isSortable: false
  },
  TaskType: {
    displayName: 'Task Type',
    schemaName: 'TaskType',
    dataType: TaskAttributeDataType.MultiSelect,
    renderType: TaskAttributeRenderType.MultiSelect,
    isSortable: true
  },
  status: {
    displayName: 'Task Status',
    schemaName: 'status',
    dataType: TaskAttributeDataType.MultiSelect,
    renderType: TaskAttributeRenderType.MultiSelect,
    isSortable: true
  },
  CompletedOn: {
    displayName: 'Completed On',
    schemaName: 'CompletedOn',
    dataType: TaskAttributeDataType.Text,
    renderType: TaskAttributeRenderType.Datetime,
    isSortable: true
  },
  CreatedOn: {
    displayName: 'Created On',
    schemaName: 'CreatedOn',
    dataType: TaskAttributeDataType.Text,
    renderType: TaskAttributeRenderType.Datetime,
    isSortable: true
  },
  ModifiedBy: {
    displayName: 'Modified By',
    schemaName: 'ModifiedBy',
    dataType: TaskAttributeDataType.Text,
    renderType: TaskAttributeRenderType.Textbox,
    isSortable: true
  },
  ModifiedOn: {
    displayName: 'Modified On',
    schemaName: 'ModifiedOn',
    dataType: TaskAttributeDataType.Text,
    renderType: TaskAttributeRenderType.Datetime,
    isSortable: true
  }
};

const getCustomObjectMetaData = (
  currentMetadata: ILeadAttribute,
  allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>
): void => {
  if (currentMetadata?.CustomObjectMetaData?.Fields?.length) {
    currentMetadata?.CustomObjectMetaData?.Fields?.forEach((cfsMetaData) => {
      const cfsSchemaName = `P_${currentMetadata?.SchemaName}~${cfsMetaData?.SchemaName}`;
      allMetadata[cfsSchemaName] = {
        schemaName: cfsSchemaName,
        displayName: `${currentMetadata?.DisplayName} - ${cfsMetaData?.DisplayName}`,
        renderType: cfsMetaData?.RenderType as RenderType,
        cfsDisplayName: cfsMetaData?.DisplayName,
        isCFS: true,
        parentSchemaName: currentMetadata?.SchemaName,
        dataType: cfsMetaData?.DataType,
        parentField: cfsMetaData?.ParentField
      };
    });
  }
};

const getLeadMetaData = (currentMetadata: ILeadAttribute): IAugmentedSmartViewEntityMetadata => {
  return {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType: currentMetadata?.RenderType,
    dataType: currentMetadata?.DataType,
    parentField: currentMetadata?.ParentField
  };
};

const getAugmentedLeadMetaData = (
  metaDataMap: ILeadMetadataMap,
  singularLeadRepName: string
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  if (!metaDataMap) {
    return {};
  }

  const augmentedLeadMetadata = Object.values(metaDataMap)?.reduce(
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadata: ILeadAttribute
    ) => {
      if (currentMetadata?.DataType === DataType.CustomObject) {
        // Flattening custom fields
        getCustomObjectMetaData(currentMetadata, allMetadata);
      } else if (currentMetadata?.SchemaName === GROUPS) {
        allMetadata[currentMetadata.SchemaName] = {
          ...getLeadMetaData(currentMetadata),
          displayName: DISPLAY_NAME.SALES_GROUP
        };
      } else if (RedundentLeadSchemaNames[currentMetadata?.SchemaName]) {
        // Adding 'Lead' before display names of system schemas which are same between lead and task
        allMetadata[currentMetadata.SchemaName] = {
          ...getLeadMetaData(currentMetadata),
          displayName: `${singularLeadRepName} ${currentMetadata.DisplayName}`
        };
      } else {
        allMetadata[currentMetadata?.SchemaName] = getLeadMetaData(currentMetadata);
      }

      if (currentMetadata?.DataType === DataType.CustomObject) return allMetadata;

      // Add prefix (P_) for all lead schema names to differentiate schema names between lead and task
      allMetadata[`P_${currentMetadata.SchemaName}`] = {
        ...allMetadata[currentMetadata.SchemaName],
        schemaName: `${leadSchemaNamePrefix}${currentMetadata.SchemaName}`
      };
      // deleting schema record key which doesnt have P_ prefix
      delete allMetadata[currentMetadata.SchemaName];

      return allMetadata;
    },
    {}
  );
  return { ...augmentedLeadMetadata, ...customFormedLeadMetadata(singularLeadRepName) };
};

const getTaskMetaData = (currentMetadata: ITaskAttribute): IAugmentedTaskMetaData => {
  return {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType: currentMetadata?.RenderType,
    dataType: currentMetadata?.DataType,
    isSortable: true
  };
};

// eslint-disable-next-line complexity, max-lines-per-function
const reduceTaskMetadata = (config: {
  allMetaData: Record<string, IAugmentedTaskMetaData>;
  currentMetadata: ITaskAttribute;
  taskMetaData: ITaskMetadata;
  augmentedTaskType: string;
}): Record<string, IAugmentedTaskMetaData> => {
  const { allMetaData, currentMetadata, taskMetaData, augmentedTaskType } = config;

  if (NotRequiredSchemas[currentMetadata?.SchemaName]) {
    return allMetaData;
  }

  if (augmentedTaskType === '-1' && currentMetadata?.SchemaName?.startsWith('mx')) {
    return allMetaData;
  }

  if (currentMetadata?.SchemaName === SCHEMA_NAMES.LOCATION) {
    allMetaData[currentMetadata.SchemaName] = {
      ...getTaskMetaData(currentMetadata),
      isLocationEnabled: taskMetaData?.configuration?.Location?.IsEnabled
    };
    return allMetaData;
  }

  // Change displayName for specific fields
  if (FieldsToChangeDisplayName[currentMetadata?.DisplayName]) {
    allMetaData[currentMetadata.SchemaName] = {
      ...getTaskMetaData(currentMetadata),
      displayName:
        (FieldsToChangeDisplayName[currentMetadata?.DisplayName] as string) ||
        currentMetadata?.DisplayName
    };
    return allMetaData;
  }

  if (
    currentMetadata?.SchemaName === SCHEMA_NAMES.RELATED_ENTITY_ID &&
    currentMetadata?.DisplayName === SCHEMA_NAMES.ASSOCIATED_LEAD
  ) {
    allMetaData[currentMetadata.SchemaName] = {
      ...getTaskMetaData(currentMetadata),
      displayName: ASSOCIATED_TO
    };
    return allMetaData;
  }

  allMetaData[currentMetadata.SchemaName] = getTaskMetaData(currentMetadata);
  return allMetaData;
};

const getAugmentedTaskMetaData = (
  taskMetaData: ITaskMetadata,
  leadSingularName: string,
  augmentedTaskType: string
): Record<string, IAugmentedTaskMetaData> => {
  if (!taskMetaData) {
    return {};
  }
  const metaDataMap = taskMetaData?.fields;

  const augmentedTaskMetadata = Object.values(metaDataMap)?.reduce(
    (allMetaData: Record<string, IAugmentedTaskMetaData>, currentMetadata: ITaskAttribute) => {
      return reduceTaskMetadata({
        allMetaData,
        currentMetadata,
        taskMetaData,
        augmentedTaskType
      });
    },
    {}
  );

  return { ...augmentedTaskMetadata, ...customFormedTaskMetadata };
};

interface IFetchLeadAndTaskMetadata {
  metadata: {
    leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
    taskMetadata: Record<string, IAugmentedTaskMetaData>;
  };
  taskRepName: string;
  leadRepName: string;
  oppRepName: string;
}

const leadAndTaskMetadataEmpty = {
  metadata: {
    leadMetadata: {},
    taskMetadata: {}
  },
  taskRepName: 'Task',
  leadRepName: 'Lead',
  oppRepName: 'Opportunity'
};

// eslint-disable-next-line complexity, max-lines-per-function
const fetchLeadAndTaskMetadata = async (
  entityCode: string,
  callerSource: CallerSource,
  tabId: string
): Promise<IFetchLeadAndTaskMetadata> => {
  try {
    const leadType = await getStringifiedLeadType(tabId);

    const augmentedTaskType = entityCode?.split(',')?.length > 1 ? '-1' : entityCode;
    const response = await Promise.all([
      fetchMetaData(callerSource, leadType),
      fetchTaskMetaData(augmentedTaskType, callerSource),
      getIsAccountEnabled(callerSource),
      getOpportunityRepresentationName(callerSource),
      getSettingConfig(settingKeys.EnableESSForLeadManagement, CallerSource.SmartViews)
    ]);
    const representationName = await fetchRepresentationName(CallerSource.SmartViews, leadType);
    const leadMetadata = response?.[0] || {};
    const taskMetadata = (response?.[1] as ITaskMetadata) || {};
    const isAccountEnabled = response?.[2];
    const oppRepName = response?.[3];

    if (!leadMetadata || !taskMetadata) {
      return leadAndTaskMetadataEmpty;
    }

    const singularLeadRepName = representationName?.SingularName ?? 'Lead';
    const singularOppRepName = oppRepName?.OpportunityRepresentationSingularName ?? 'Opportunity';
    const augmentedLeadMetaData = getAugmentedLeadMetaData(leadMetadata, singularLeadRepName);
    const augmentedTaskMetaData = getAugmentedTaskMetaData(
      taskMetadata,
      singularLeadRepName,
      augmentedTaskType
    );

    return {
      metadata: {
        leadMetadata: getFilteredLeadMetadataForNonLeadTab({
          leadMetadata: augmentedLeadMetaData,
          isAccountEnabled
        }),
        taskMetadata: augmentedTaskMetaData
      },
      taskRepName: taskMetadata?.taskRepName || 'Task',
      leadRepName: singularLeadRepName,
      oppRepName: singularOppRepName
    };
  } catch (error) {
    return leadAndTaskMetadataEmpty;
  }
};

export default fetchLeadAndTaskMetadata;
