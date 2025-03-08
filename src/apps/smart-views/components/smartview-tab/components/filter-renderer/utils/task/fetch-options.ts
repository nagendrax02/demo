import { trackError } from 'common/utils/experience/utils/track-error';
import { SCHEMA_NAMES, ownerSchemas } from 'apps/smart-views/constants/constants';
import { getAugmentedOptions, getUserDropdownOptions } from '../common/fetch-options';
import {
  getDropdownOptions,
  getTaskStatusOptions,
  getTaskTypeOptions
} from 'common/utils/entity-data-manager/task';
import { IBody, ITaskTypeOption } from 'common/utils/entity-data-manager/task/task.types';
import { CallerSource } from 'common/utils/rest-client';
import { TaskTypeCategory } from 'common/types/entity/task/metadata.types';
import {
  AccessType,
  ActionType,
  IEntityPermissionAccess,
  PermissionEntityType,
  getRestrictedData
} from 'common/utils/permission-manager';
import { ALL_TASK_TYPE_VALUE, TASK_CATEGORY_OPTIONS } from '../../constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { ITaskTypeFilterOption } from '../../filter-renderer.types';
import { addBadgeComponent } from '../add-badge';

const getOptionsFromMetaData = async (payload: IBody): Promise<IOption[]> => {
  try {
    const options =
      (await getDropdownOptions({
        body: payload,
        callerSource: CallerSource.SmartViews
      })) || [];

    const augmentedOptions = getAugmentedOptions(options);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const isTypeRestricted = (taskType: string, restrictedData: IEntityPermissionAccess): boolean => {
  if (
    restrictedData?.accessType === AccessType.NoAccess ||
    (restrictedData?.accessType === AccessType.PartialAccess &&
      restrictedData?.RestrictedTypes?.[taskType])
  ) {
    return true;
  }
  return false;
};

const isOptionNotAllowed = (
  option: ITaskTypeOption,
  restrictedData: IEntityPermissionAccess,
  code: string
): boolean => {
  // check permission of taskType
  const { Id: taskType, Category } = option || {};
  const allowedTaskTypes = code?.split(',') || [];
  if (isTypeRestricted(taskType, restrictedData)) {
    return true;
  }

  if (code === ALL_TASK_TYPE_VALUE) {
    return false;
  }

  // check if tab supports taskType through entityCode property
  if (!allowedTaskTypes.includes(taskType) && !allowedTaskTypes.includes(Category)) {
    return true;
  }
  return false;
};

const generateTaskTypeOptions = (
  appointmentOptions: ITaskTypeFilterOption[],
  toDoOptions: ITaskTypeFilterOption[],
  areAllCategoryOptionsPresent: Record<string, boolean>
): ITaskTypeFilterOption[] => {
  let finalOptions: ITaskTypeFilterOption[] = [];

  // handle appointment options
  if (appointmentOptions?.length && areAllCategoryOptionsPresent[TASK_CATEGORY_OPTIONS[0].value]) {
    finalOptions.push({ ...TASK_CATEGORY_OPTIONS[0], subOptions: appointmentOptions });
  } else {
    finalOptions = [...finalOptions, ...appointmentOptions];
  }

  // handle todo options
  if (toDoOptions?.length && areAllCategoryOptionsPresent[TASK_CATEGORY_OPTIONS[1].value]) {
    finalOptions.push({ ...TASK_CATEGORY_OPTIONS[1], subOptions: toDoOptions });
  } else {
    finalOptions = [...finalOptions, ...toDoOptions];
  }

  return finalOptions;
};

const augmentedTaskTypeOptions = (
  options: ITaskTypeOption[],
  restrictedData: IEntityPermissionAccess,
  code: string
): ITaskTypeFilterOption[] => {
  const appointmentOptions: ITaskTypeFilterOption[] = [];
  const toDoOptions: ITaskTypeFilterOption[] = [];
  const areAllCategoryOptionsPresent = { ['0']: true, ['1']: true };

  options?.map((option) => {
    const category = Number(option.Category);
    if (isOptionNotAllowed(option, restrictedData, code)) {
      areAllCategoryOptionsPresent[category] = false;
      return;
    }
    if (category === TaskTypeCategory.Appointment) {
      appointmentOptions.push({
        label: option.Name,
        value: option.Id,
        text: option.Color
      });
    } else {
      toDoOptions.push({
        label: option.Name,
        value: option.Id,
        text: option.Color
      });
    }
  });

  const finalOptions = generateTaskTypeOptions(
    appointmentOptions,
    toDoOptions,
    areAllCategoryOptionsPresent
  );
  return finalOptions;
};

export const fetchTaskOptions = async (payload: IBody): Promise<IOption[]> => {
  try {
    const { schemaName, searchText, code } = payload;
    // Type needs to be sent to task dropdown options get api call. So, deleting code and adding Type
    payload.Type = code ?? ALL_TASK_TYPE_VALUE;
    delete payload.code;

    if (ownerSchemas[schemaName]) {
      return await getUserDropdownOptions(searchText);
    }
    if (schemaName === SCHEMA_NAMES.TASK_STATUS) {
      const taskStatusOptions = (await getTaskStatusOptions(searchText)) as IOption[];
      return addBadgeComponent(taskStatusOptions);
    }
    if (schemaName === SCHEMA_NAMES.TASK_TYPE) {
      const [taskTypeOptions, restrictedData] = await Promise.all([
        getTaskTypeOptions(CallerSource.SmartViews, searchText),
        getRestrictedData({
          entityType: PermissionEntityType.Task,
          actionType: ActionType.View,
          callerSource: CallerSource.SmartViews
        })
      ]);
      if (taskTypeOptions?.length) {
        return augmentedTaskTypeOptions(taskTypeOptions, restrictedData, payload.Type);
      }
      return [];
    }
    return await getOptionsFromMetaData(payload);
  } catch (error) {
    trackError(error);
    return [];
  }
};
