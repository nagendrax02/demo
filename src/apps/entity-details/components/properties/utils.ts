import { EntityType, ILead } from 'common/types';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { IAugmentedEntity, IPropertiesConfig } from '../../types';
import { getAugmentedLeadProperty } from '../../utils/augment-entity-data/lead/properties';
import { IEntityProperty, IProperty } from 'common/types/entity/lead/metadata.types';
import { IProcessFormsData } from 'common/utils/process/process.types';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { getProcessActionConfig, workAreaIds } from 'common/utils/process';
import { updateLeadAndLeadTabs } from '../../../forms/utils';
import { IEntityDetailsCoreData } from '../../types/entity-data.types';
import { EntityDetailsEvents } from 'common/utils/experience';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

interface IHandleSuccessUpdate {
  type: EntityType;
  augmentedEntityData: IAugmentedEntity;
  setAugmentedEntityData: (data: IAugmentedEntity) => void;
}

interface IGetName {
  property: IEntityProperty;
  fields: Record<string, string | null> | undefined;
}

const handleSuccessUpdate = async (props: IHandleSuccessUpdate): Promise<void> => {
  const { type, augmentedEntityData, setAugmentedEntityData } = props;
  const response = await (await getEntityDataManager(type))?.fetchData();
  let augmentedUpdatedProperty: IProperty = {
    entityProperty: [],
    fields: {},
    entityConfig: {}
  };
  if (type === EntityType.Lead) {
    augmentedUpdatedProperty = getAugmentedLeadProperty(response as ILead);
  }

  const updatedAugmentedData = {
    ...augmentedEntityData,
    properties: augmentedUpdatedProperty
  };

  setAugmentedEntityData(updatedAugmentedData);
};

const getName = (props: IGetName): string => {
  const { property, fields } = props;
  const userFields = {
    CreatedByName: 'CreatedByName',
    ModifiedByName: 'ModifiedByName'
  };

  if (userFields[property?.schemaName]) {
    return property?.value;
  }
  return fields?.Value || '';
};

const canUpdateAccount = (value: string): boolean => {
  return value ? value.toLowerCase() === 'true' : false;
};

export const getConvertedEditAction = ({
  action,
  processFormsData,
  isLoading
}: {
  action: IActionWrapperItem;
  processFormsData: IProcessFormsData | null;
  isLoading: boolean;
}): IActionWrapperItem => {
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    action,
    processFormsData || {}
  );
  const hasOneForm = totalForms === 1;

  return {
    ...convertedAction,
    title: hasOneForm ? firstFormName : convertedAction?.title,
    isLoading: isLoading,
    subMenu: hasOneForm ? [] : convertedAction?.subMenu
  };
};

export const showEditPropertiesProcessForm = async ({
  data,
  coreData,
  customConfig
}: {
  data: IMenuItem;
  coreData: IEntityDetailsCoreData;
  customConfig?: Record<string, string>;
}): Promise<void> => {
  const processFormConfig = (
    await import('apps/forms/forms-process-integration')
  ).getProcessFormConfigBasedOnProcessId({
    workAreaId: data?.workAreaConfig?.workAreaId as number,
    processId: data?.value ?? '',
    additionalData: data?.workAreaConfig?.additionalData,
    customConfig: customConfig,
    onSuccess: () => {
      updateLeadAndLeadTabs();
    },
    onShowFormChange: () => {
      updateLeadAndLeadTabs();
    },
    coreData
  });
  if (processFormConfig) {
    useFormRenderer.getState().setFormConfig(processFormConfig);
  }
};

interface IHandleEdit {
  isLoading: boolean;
  properties: IPropertiesConfig;
  entityDetailsCoreData: IEntityDetailsCoreData;
  type: EntityType;
}

export const handleEdit = async (props: IHandleEdit): Promise<void> => {
  const { isLoading, properties, entityDetailsCoreData, type } = props;
  if (isLoading) return;
  const processActionClickHandler = await import('./edit-button-action-handler');
  const action = {
    id: 'leadPropertiesEdit',
    title: 'edit',
    workAreaConfig: properties?.workAreaConfig ?? { workAreaId: workAreaIds.NA }
  };
  const formConfig = await processActionClickHandler.getFormConfig({
    action,
    onSuccess: async () => {
      updateLeadAndLeadTabs();
    },
    type: properties?.editActionType || type,
    onShowFormChange: (showForm) => {
      if (!showForm) {
        useFormRenderer.getState().setFormConfig(null);
      }
    },
    entityDetailsCoreData,
    formTitle: properties?.formTitle,
    isAssociatedEntity: properties?.isAssociatedEntity
  });
  useFormRenderer.getState().setFormConfig(formConfig);
};

export const getPropertiesExpEventName = (isAssociatedEntity: boolean): string => {
  return `${isAssociatedEntity ? 'Associated Entity' : ''} ${
    EntityDetailsEvents.PropertiesRender
  }`?.trim();
};

export const getUserName = (
  property: IEntityProperty,
  fields?: Record<string, string | null>
): string | undefined => {
  if (property.doNotUseNameAsValue) return undefined;
  return property.isRenderedInGrid ? property.name : getName({ property, fields });
};
export { handleSuccessUpdate, getName, canUpdateAccount };
