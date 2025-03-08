import { useMemo } from 'react';
import {
  IAugmentedAction,
  IEntityRepresentationName
} from 'src/apps/entity-details/types/entity-data.types';
import ButtonActions from 'apps/entity-details/components/vcard/actions/button-actions';
import MoreActions from 'apps/entity-details/components/vcard/actions/more-actions';
import { EntityType, ILead, ILeadMetaData, IOpportunityMetaData } from 'common/types';
import styles from './lead-actions.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import useActions from 'apps/entity-details/components/vcard/actions/use-actions';
import {
  addRenderAsIconForTypeButton,
  createEntityDetailsCoreData,
  mapEntityTypeToGetActions
} from './utils';
import { MAX_VCARD_ACTIONS } from './constants';
import { IGlobalSearchActionEntity } from '../augmentation.types';
import { getLeadName } from 'apps/entity-details/utils';
import CustomMoreOptionsButton from './components/CustomMoreOptionsButton';

interface ILeadActionsProps {
  entityData: ILead;
  metadata: ILeadMetaData | IOpportunityMetaData | null;
  isLoading: boolean;
  entityType: EntityType;
  entityId: string;
  metadataKey: string;
  setRefreshQuickView?: (value: string) => void;
}
const LeadActions: React.FC<ILeadActionsProps> = ({
  entityData,
  metadata,
  isLoading,
  entityType,
  entityId,
  metadataKey,
  setRefreshQuickView
}: ILeadActionsProps) => {
  const actions = useMemo(
    () => (entityData ? mapEntityTypeToGetActions(entityType)(entityData) : []),
    [entityType, entityData]
  );
  const iconButtonActions = addRenderAsIconForTypeButton(actions as IAugmentedAction);
  const globalSearchActionEntity: IGlobalSearchActionEntity = {
    entityType,
    entityRawData: entityData
  };
  const segregatedActions = useActions(
    iconButtonActions,
    MAX_VCARD_ACTIONS,
    globalSearchActionEntity
  );
  const { buttonActions, moreActions } = segregatedActions;
  const coreData = useMemo(() => {
    if (metadata && metadataKey) {
      const repNames: IEntityRepresentationName = metadata[
        metadataKey
      ] as IEntityRepresentationName;
      const entity = {
        entityType: entityType,
        entityId: entityId,
        entityName: getLeadName(entityData?.details?.Fields)
      };
      return createEntityDetailsCoreData(entity, repNames);
    }
    return null;
  }, [entityId, metadata, metadataKey]);
  const setRefreshLeadOnFormSuccess = (): void => {
    setRefreshQuickView?.(Date.now().toString());
  };

  if (isLoading) {
    return (
      <div>
        <Shimmer height={'40px'} width="100%" />
      </div>
    );
  }

  if ((!buttonActions.length && !moreActions.length) || !coreData) {
    return null;
  }
  return (
    <div className={styles.vcard_actions_wrapper}>
      <ButtonActions
        actions={buttonActions}
        coreData={coreData}
        onSuccess={setRefreshLeadOnFormSuccess}
        customClass={`${
          buttonActions.length !== 1
            ? styles.vcard_footer_actions
            : styles.vcard_footer_actions_single_button
        }`}
        entityName={coreData?.entityName}
        customConfig={entityData?.details?.Fields as Record<string, string>}
        renderAsV2Component
      />
      <div className={styles.vcard_more_actions_btn}>
        <MoreActions
          onSuccess={setRefreshLeadOnFormSuccess}
          actions={moreActions}
          coreData={coreData}
          customButton={buttonActions.length === 0 ? CustomMoreOptionsButton : undefined}
          entityName={coreData?.entityName}
          renderAsV2Component
          customConfig={entityData?.details?.Fields as Record<string, string>}
          customClass={styles.vcard_footer_actions}
        />
      </div>
    </div>
  );
};

export default LeadActions;
