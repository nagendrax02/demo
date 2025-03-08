import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import {
  FeatureRestrictionConfigMap,
  IActionConfig,
  IGlobalSearchActionEntity,
  IAugmentedAction,
  IProcessConfig,
  ISegregatedActions
} from 'apps/entity-details/types/entity-data.types';
import {
  getCallerSource,
  getSegregatedActions,
  handleOpportunityButton,
  handleDisplayNameAndProcess
} from './utils/utils';
import { PROMISE_FULFILLED } from 'common/constants';
import { handleProcessButton } from './utils/process-button';
import { handleSalesActivityButton } from './utils/sales-activity';
import { handleActionSegregation } from 'apps/entity-details/utils/augment-entity-data/lead/action-utils/action';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { ISettingConfiguration } from 'common/types/entity/lead';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';

interface IHandleOperations {
  settingConfig: ISettingConfiguration | undefined;
  updatedAction: IActionConfig[];
  salesActivityPromise: PromiseSettledResult<string | null>;
  processConfigPromise: PromiseSettledResult<IProcessConfig | null>;
  opportunityConfigPromise: PromiseSettledResult<string | null>;
  buttonActionsLimit?: number;
  restrictionMapPromise: PromiseSettledResult<Record<string, boolean>>;
}

const handleOperations = (props: IHandleOperations): ISegregatedActions => {
  const {
    settingConfig,
    updatedAction,
    salesActivityPromise,
    processConfigPromise,
    opportunityConfigPromise,
    buttonActionsLimit,
    restrictionMapPromise
  } = props;

  const salesActivityDisplayName =
    salesActivityPromise?.status === PROMISE_FULFILLED ? salesActivityPromise?.value : null;

  const processConfig =
    processConfigPromise?.status === PROMISE_FULFILLED ? processConfigPromise?.value : null;

  const oppDisplayName =
    opportunityConfigPromise?.status === PROMISE_FULFILLED ? opportunityConfigPromise?.value : null;

  const restrictionMap =
    restrictionMapPromise?.status === PROMISE_FULFILLED ? restrictionMapPromise?.value : null;

  return handleDisplayNameAndProcess({
    config: {
      settingConfig: settingConfig,
      actions: updatedAction
    },
    salesActivityDisplayName,
    processConfig,
    oppDisplayName,
    buttonActionsLimit,
    restrictionMap
  });
};

const getUpdatedActionWithPermissionApplied = async (
  getEntityActionConfig: (props) => Promise<IActionConfig[]>,
  config: IAugmentedAction,
  globalSearchActionEntity?: IGlobalSearchActionEntity
): Promise<IActionConfig[]> => {
  const { actions } = config;
  if (globalSearchActionEntity) {
    const { entityType, entityRawData, entityCode } = globalSearchActionEntity;
    const response = await getEntityActionConfig({
      configData: actions,
      entityType: entityType,
      canUpdate: entityRawData?.details.Fields?.CanUpdate?.toLowerCase() === 'true',
      callerSource: getCallerSource(),
      id: entityCode
    });
    return response;
  }
  const { entityType, augmentedEntityData } = useEntityDetailStore.getState();
  const response = await getEntityActionConfig({
    configData: actions,
    entityType: entityType,
    canUpdate: augmentedEntityData?.attributes?.fields?.CanUpdate?.toLowerCase() === 'true',
    callerSource: getCallerSource(),
    id: augmentedEntityData?.entityCode ? `${augmentedEntityData?.entityCode}` : undefined
  });

  return response;
};

const handleFeatureRestriction = async (
  featureRestrictionConfigMap: FeatureRestrictionConfigMap | undefined
): Promise<Record<string, boolean>> => {
  const restrictionMap: Record<string, boolean> = {};
  if (featureRestrictionConfigMap) {
    const keys = Object.keys(featureRestrictionConfigMap);
    const promises = keys.map((key) => isFeatureRestricted(featureRestrictionConfigMap?.[key]));

    const results = await Promise.all(promises);

    keys.forEach((key, index) => {
      restrictionMap[key] = results?.[index];
    });
  }

  return restrictionMap;
};

// eslint-disable-next-line max-lines-per-function
const useActions = (
  config: IAugmentedAction,
  buttonActionsLimit?: number,
  globalSearchActionEntity?: IGlobalSearchActionEntity
): ISegregatedActions => {
  const { actions, settingConfig, featureRestrictionConfigMap } = config;
  const [segregatedActions, setSegregatedActions] = useState<ISegregatedActions>(
    getSegregatedActions(actions, buttonActionsLimit)
  );
  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const [
          salesActivityPromise,
          processConfigPromise,
          opportunityConfigPromise,
          restrictionMapPromise
        ] = await Promise.allSettled([
          handleSalesActivityButton(actions),
          handleProcessButton(actions, settingConfig),
          handleOpportunityButton(actions),
          handleFeatureRestriction(featureRestrictionConfigMap)
        ]);
        import('common/utils/entity-action').then(async ({ getEntityActionConfig }) => {
          const updatedActionWithPermissionApplied = await getUpdatedActionWithPermissionApplied(
            getEntityActionConfig,
            config,
            globalSearchActionEntity
          );

          setSegregatedActions(
            handleOperations({
              settingConfig: settingConfig,
              updatedAction: updatedActionWithPermissionApplied,
              salesActivityPromise: salesActivityPromise,
              processConfigPromise: processConfigPromise,
              opportunityConfigPromise: opportunityConfigPromise,
              buttonActionsLimit,
              restrictionMapPromise: restrictionMapPromise
            })
          );
        });
      } catch (error) {
        trackError(error);
        setSegregatedActions(handleActionSegregation(actions, [], buttonActionsLimit));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return segregatedActions;
};

export default useActions;
