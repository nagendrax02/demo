import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect } from 'react';
import { EntityType } from 'common/types/entity.types';
import useEntityStore, { setIsUpdating } from './entitydetail.store';
import { IEntityDetailStore, IEntityRepresentationConfig } from './types/entity-store.types';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { augmentEntityData, getRepresentationName, updateMipHeaderModule } from './utils';
import { IAugmentedEntity } from './types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { LEAD_SCHEMA_NAME } from './schema-names';
import {
  getInvokingModule,
  getPermissionEntityType
} from 'common/utils/entity-action/entity-action';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import {
  getExperienceKey,
  startExperienceEvent,
  ExperienceType,
  endExperienceEvent
} from 'common/utils/experience';
import { IEntityDetailsCoreData } from './types/entity-data.types';
import { getEntityDetailsCoreData } from './utils/core-data';
import {
  getCanUpdateValue,
  getPermissionEntityId
} from './utils/augment-entity-data/opportunity/utils';
import { EntityDetailsEvents } from 'common/utils/experience';
import { validateResponse } from './utils/validate-data';
import { updateEntityAppTabConfig } from './utils/app-tab-utils';
import { getActiveAppTabId } from 'common/utils/helpers/app-tabs';
import { setFullScreenLoading } from 'common/component-lib/full-screen-header/full-screen.store';
import { getIsStoreResetNeeded, setIsStoreResetNeeded } from 'common/utils/helpers/helpers';

interface IUseEntityDetailsProps {
  type: EntityType;
  key?: number;
  queryParams?: string;
  isFullScreenMode?: boolean;
}

type HandleResponse = {
  setAugmentedEntityData: (data: IAugmentedEntity) => void;
  setRepresentationName: (config: IEntityRepresentationConfig) => void;
  type: EntityType;
  setError: (error: Error | null) => void;
  setIsLoading: (loading: boolean) => void;
  setEntityType: (data: EntityType) => void;
  showAlert: (notification: INotification) => void;
  setIsStarred: (data: boolean) => void;
  setCoreData: (data: IEntityDetailsCoreData) => void;
  isFullScreenMode?: boolean;
};

interface IHandleLeadStarred {
  setIsStarred: (data: boolean) => void;
  fields: Record<string, string | null | boolean>;
}

const handleLeadStarred = ({ setIsStarred, fields }: IHandleLeadStarred): void => {
  setIsStarred(fields?.[LEAD_SCHEMA_NAME.IS_STARRED_LEAD] === 'true');
};

// eslint-disable-next-line max-lines-per-function
const handleResponse = async ({
  setAugmentedEntityData,
  setRepresentationName,
  type,
  setError,
  setIsLoading,
  setEntityType,
  showAlert,
  setIsStarred,
  setCoreData,
  isFullScreenMode
}: HandleResponse): Promise<void> => {
  const experienceConfig = getExperienceKey();
  const appTabId = getActiveAppTabId();
  try {
    setIsUpdating(true);
    setFullScreenLoading(true);
    const response = await (await getEntityDataManager(type))?.fetchData();
    validateResponse(type, response);
    startExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.EntityDataAugmentation,
      key: experienceConfig.key
    });
    if (!isFullScreenMode) updateEntityAppTabConfig({ activeTabId: appTabId, type, response });
    const module = await import('common/utils/permission-manager');
    const canUpdate = getCanUpdateValue(type, response);
    const isUpdateRestricted =
      (await module.isRestricted({
        entity: getPermissionEntityType(type) as PermissionEntityType,
        action: ActionType.Update,
        entityId: getPermissionEntityId(type),
        callerSource: getInvokingModule(type)
      })) || !canUpdate;
    handleLeadStarred({ setIsStarred, fields: response.details.Fields });
    const augmentedData = augmentEntityData?.[type]?.(
      response,
      isUpdateRestricted
    ) as IAugmentedEntity;
    setAugmentedEntityData(augmentedData);
    const representationNames = getRepresentationName(type, response);
    setRepresentationName(representationNames);
    setCoreData(
      getEntityDetailsCoreData({
        entityType: type,
        augmentedData: augmentedData,
        repNames: representationNames,
        response: response
      })
    );
    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.EntityDataAugmentation,
      key: experienceConfig.key
    });
  } catch (error) {
    trackError(error);
    showAlert({
      type: Type.ERROR,
      message: error?.message ? `${error?.message}` : ERROR_MSG.generic
    });
    setError(error);
    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.EntityDataAugmentation,
      key: experienceConfig.key,
      hasException: true
    });
    if (!isFullScreenMode) updateEntityAppTabConfig({ activeTabId: appTabId, type, error: true });
  }
  setEntityType(type);
  setIsLoading(false);
  setIsUpdating(false);
  setFullScreenLoading(false);
  setIsStoreResetNeeded(false);
};

// eslint-disable-next-line max-lines-per-function
const useEntityDetails = ({
  type,
  key,
  queryParams,
  isFullScreenMode
}: IUseEntityDetailsProps): {
  isLoading: boolean;
  augmentedEntityData: IAugmentedEntity | null;
  // AugmentedData will also be added in return object
} => {
  const {
    isLoading,
    setIsLoading,
    setError,
    augmentedEntityData,
    setAugmentedEntityData,
    setRepresentationName,
    setEntityType,
    setIsStarred,
    setCoreData,
    resetEntityDetailStore
  }: IEntityDetailStore = useEntityStore();
  const { showAlert } = useNotification();
  useEffect(() => {
    (async (): Promise<void> => {
      updateMipHeaderModule(type);
      await handleResponse({
        setAugmentedEntityData,
        setRepresentationName,
        type,
        setError,
        setIsLoading,
        setEntityType,
        showAlert,
        setIsStarred,
        setCoreData,
        isFullScreenMode
      });
    })();

    return () => {
      if (getIsStoreResetNeeded()) resetEntityDetailStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, queryParams]);

  return {
    isLoading: isLoading,
    augmentedEntityData: augmentedEntityData
  };
};

export default useEntityDetails;
