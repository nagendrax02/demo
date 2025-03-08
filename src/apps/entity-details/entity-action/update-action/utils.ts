import { trackError } from 'common/utils/experience/utils/track-error';
import { getPurifiedContent } from 'common/utils/helpers';
import {
  IBodyResponse,
  IField,
  IGetBody,
  IGetFieldsValues,
  IHandleApiResponse,
  IHandleSetConfig,
  IUpdateStore,
  OperationStatus
} from './update.types';
import { IAugmentedEntity } from '../../types';
import { ACTION } from '../../constants';
import { fetchMetaData } from 'common/utils/entity-data-manager/lead/metadata';
import { ILeadMetadataMap } from 'common/types';
import { LEAD_SCHEMA_NAME } from '../../schema-names';
import {
  ChangeStageData,
  IConfig,
  IGetChangeStatusStageConfig,
  IGetConfig
} from '../change-stage/change-stage.types';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchMetaData as fetchOppMetaData } from 'common/utils/entity-data-manager/opportunity/metadata';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { IEntityRepresentationName } from '../../types/entity-data.types';

const getFieldsValues = async (props: IGetFieldsValues): Promise<IField[]> => {
  const { selectedOption, comments, schemaName } = props;
  if (schemaName === 'ProspectStage') {
    return [
      {
        Key: 'ProspectStage',
        Value: selectedOption?.[0]?.value
      },
      {
        Key: `mxcomments_ProspectStage`,
        Value: await getPurifiedContent(comments)
      }
    ];
  } else if (schemaName === 'OwnerId') {
    return [
      {
        Key: 'OwnerId',
        Value: selectedOption?.[0]?.value
      }
    ];
  }
  return [];
};

const getBody = async (props: IGetBody): Promise<IBodyResponse> => {
  const { selectedOption, comments, schemaName, leadId } = props;

  return {
    LeadFields: await getFieldsValues({ selectedOption, comments, schemaName }),
    LeadIds: leadId,
    LeadRetrieveCriteria: null,
    Nleads: 0,
    UpdateAll: false
  };
};

const updateVCard = (props: IUpdateStore): IAugmentedEntity => {
  const { augmentedEntityProperty, selectedOption } = props;
  if (augmentedEntityProperty?.vcard?.body?.primarySection?.components) {
    const updatedComponent = augmentedEntityProperty.vcard.body.primarySection.components?.map(
      (section) => {
        if (section?.type === 3) {
          section.config = {
            content: selectedOption[0]?.value
          };
        }
        return section;
      }
    );
    const updatedVcard = {
      ...augmentedEntityProperty.vcard,
      body: {
        ...augmentedEntityProperty.vcard.body,
        primarySection: {
          ...augmentedEntityProperty.vcard.body.primarySection,
          components: updatedComponent
        }
      }
    };
    return { ...augmentedEntityProperty, vcard: updatedVcard };
  }
  return augmentedEntityProperty;
};

const updateProperties = (props: IUpdateStore): IAugmentedEntity => {
  const { augmentedEntityProperty, selectedOption, actionType } = props;
  if (
    augmentedEntityProperty?.properties?.entityProperty &&
    augmentedEntityProperty?.properties?.fields?.ProspectStage
  ) {
    const updatedFields = augmentedEntityProperty.properties.fields;
    updatedFields.ProspectStage = selectedOption[0]?.value;
    const updatedEntityProperty = augmentedEntityProperty.properties.entityProperty?.map(
      (property) => {
        if (property.schemaName === 'ProspectStage' && actionType === ACTION.ChangeStage) {
          property.value = selectedOption[0].value;
        } else if (property.schemaName === 'OwnerId' && actionType === ACTION.ChangeOwner) {
          property.value = selectedOption[0].value;
        }
        return property;
      }
    );
    const updatedProperty = {
      ...augmentedEntityProperty.properties,
      entityProperty: updatedEntityProperty,
      fields: updatedFields
    };
    return { ...augmentedEntityProperty, properties: updatedProperty };
  }
  return augmentedEntityProperty;
};

const handleSetConfig = (props: IHandleSetConfig): void => {
  const { augmentedEntityProperty, selectedOption, setAugmentedEntityData, actionType } = props;

  const updatedPropertiesData = updateProperties({
    augmentedEntityProperty,
    selectedOption,
    actionType
  });
  setAugmentedEntityData(updatedPropertiesData);

  if (actionType === ACTION.ChangeStage) {
    const updatedVCardData = updateVCard({ augmentedEntityProperty, selectedOption, actionType });
    setAugmentedEntityData(updatedVCardData);
  }
  updateLeadAndLeadTabs();
};

const handleSuccess = (props: IHandleApiResponse): void => {
  const {
    handleSuccessNotification,
    augmentedEntityProperty,
    selectedOption,
    setAugmentedEntityData,
    actionType,
    onSuccess
  } = props;

  handleSuccessNotification();
  if (augmentedEntityProperty) {
    handleSetConfig({
      augmentedEntityProperty,
      selectedOption,
      setAugmentedEntityData,
      actionType
    });
  }
  if (onSuccess) onSuccess();
};

const handleApiResponse = (props: IHandleApiResponse): void => {
  const { response, handleErrorNotification, onSuccess } = props;

  if (
    response.OperationStatus === OperationStatus.SUCCESS ||
    response.Status === OperationStatus.SUCCESS
  ) {
    handleSuccess(props);
    onSuccess?.();
  } else if (
    response.OperationStatus === OperationStatus.ERROR ||
    response.OperationStatus === OperationStatus.FAILURE ||
    response.Status === OperationStatus.ERROR
  ) {
    handleErrorNotification(response.OperationStatus);
  }
};

const getConfig = async (props: IGetConfig): Promise<void> => {
  try {
    const { setConfig, setCommentsOptions, callerSource } = props;
    const metaData = (await fetchMetaData(callerSource)) as ILeadMetadataMap;

    const changeStageData = metaData?.[
      LEAD_SCHEMA_NAME.PROSPECT_STAGE
    ] as unknown as ChangeStageData;

    if (changeStageData?.MandateComments) {
      setConfig(changeStageData.MandateComments as IConfig);
      const commentsConfig = changeStageData.MandateComments as IConfig;
      if (commentsConfig.Options) {
        const options = commentsConfig.Options.split('~').map((opt) => ({
          label: opt,
          value: opt
        }));
        setCommentsOptions([options[0]]);
      }
    }
  } catch (error) {
    trackError(error);
  }
};

const getChangeStatusStageConfig = async (props: IGetChangeStatusStageConfig): Promise<void> => {
  try {
    const { setConfig, callerSource, eventCode } = props;
    const [metaData] = await Promise.all([
      fetchOppMetaData(callerSource, eventCode ? `${eventCode}` : undefined)
    ]);

    const internalSchemaMetaDataMap = createHashMapFromArray<IActivityAttribute>(
      Object.values(metaData?.Fields || {}) || [],
      'InternalSchemaName'
    );

    const changeStatusStageData =
      internalSchemaMetaDataMap?.[
        // eslint-disable-next-line @typescript-eslint/dot-notation
        'OpportunityComment'
      ];

    if (changeStatusStageData && changeStatusStageData?.IsMandatory) {
      setConfig({
        showCommentBox: true,
        MaxLength: changeStatusStageData?.MaxLength,
        SchemaName: changeStatusStageData?.SchemaName
      });
    }
  } catch (error) {
    trackError(error);
  }
};

const getUpdateModalTitle = (actionType: string): string => {
  switch (actionType) {
    case ACTION.ChangeOwner:
      return 'Change Owner';
    case ACTION.ChangeStage:
      return 'Change Stage';
    case ACTION.Change_Status_Stage:
      return 'Change Status/Stage';
    case ACTION.ChangeTaskOwner:
      return 'Change Task Owner';
  }
  return '';
};

interface IValidateChangeStatusStageAction {
  stageValue: IOption[];
  statusValue: IOption[];
  message: string;
  config: IConfig | undefined;
  setStatusError: (value: React.SetStateAction<boolean>) => void;
  setStageError: (value: React.SetStateAction<boolean>) => void;
  setMessageError: (value: React.SetStateAction<boolean>) => void;
}

const validateChangeStatusStageAction = (props: IValidateChangeStatusStageAction): boolean => {
  const {
    statusValue,
    stageValue,
    setStatusError,
    setStageError,
    setMessageError,
    config,
    message
  } = props;
  let isValidAction = true;
  try {
    if (!statusValue?.length) {
      setStatusError(true);
      isValidAction = false;
    }
    if (!stageValue?.length) {
      setStageError(true);
      isValidAction = false;
    }
    if (config?.showCommentBox && !message) {
      setMessageError(true);
      isValidAction = false;
    }
  } catch (err) {
    trackError(err);
  }
  return isValidAction;
};

const getRepName = (repName: IEntityRepresentationName, length?: number): string => {
  return (length || 0) > 1 ? repName?.PluralName : repName?.SingularName;
};

export {
  getFieldsValues,
  getBody,
  handleSetConfig,
  handleApiResponse,
  getConfig,
  getUpdateModalTitle,
  validateChangeStatusStageAction,
  getChangeStatusStageConfig,
  getRepName
};
