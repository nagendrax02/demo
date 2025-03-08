import withSuspense from '@lsq/nextgen-preact/suspense';
import { trackError } from 'common/utils/experience/utils/track-error';
import { Variant } from 'common/types';
import { useActiveTab, refreshGrid, getTabData } from '../../smartview-tab/smartview-tab.store';
import Iframe from 'common/component-lib/iframe';
import { useRef, useState, lazy } from 'react';
import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import styles from './merge-leads.module.css';
import useMarvinComponent from 'common/utils/marvin-helper';
import { EXTERNAL_FEATURE, ExternalComponentRoute } from '../constants';
import { openLeadDetailTab } from 'common/utils/helpers/helpers';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface IMergeLeads {
  entityIds: string[];
  onClose: (show: boolean) => void;
}

const MergeLeads = (props: IMergeLeads): JSX.Element => {
  const { entityIds, onClose } = props;
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(true);

  const leadRepresentationName = useLeadRepName();

  const ref = useRef<HTMLIFrameElement | null>(null);

  const activeTabId = useActiveTab();
  const tabDetails = getTabData(activeTabId);

  const handleReceivedMessage = async (event): Promise<void> => {
    try {
      if (event.Type === 'MERGE_ENTITY') {
        onClose(true);
      }
      if (event.Type === 'MERGE_ENTITY_SUCCESS') {
        refreshGrid(activeTabId);
      }
      if (event.Type === 'MERGE_ENTITY_OPEN_ENTITY') {
        openLeadDetailTab(event?.payload?.entityId as string);
        onClose(true);
      }
    } catch (error) {
      trackError(error);
    }
  };

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.MergeLeads,
      payload: {
        leadTypeConfiguration: tabDetails?.leadTypeConfiguration
      }
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.mergeLeads
  });

  const onConfirmModalClose = (): void => {
    setShowConfirmationModal(false);
    onClose(false);
  };

  const getDescription = (): string => {
    if (entityIds.length <= 1) return 'Please select at least 2 leads to merge';
    return `You can only merge up to 20 ${
      leadRepresentationName?.SingularName || 'lead'
    } at once. Please select fewer than 20 ${leadRepresentationName.SingularName || 'lead'}`;
  };

  if (entityIds.length <= 1 || entityIds.length > 20) {
    return (
      <ConfirmationModal
        onClose={onConfirmModalClose}
        show={showConfirmationModal}
        title="Unable to Proceed"
        description={getDescription()}
        buttonConfig={[
          {
            id: 1,
            name: 'Ok',
            variant: Variant.Secondary,
            onClick: onConfirmModalClose
          }
        ]}
      />
    );
  }

  return (
    <div className={styles.merge_leads_wrapper}>
      <Iframe
        src={`${
          getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string
        }/mergeentity?isShared=true&entity_merge_ids=${entityIds.join(
          'MXDATASEPERATOR'
        )}&isSWLite=true&feature=${EXTERNAL_FEATURE.mergeLeads}`}
        width={'100%'}
        height={'100%'}
        id="iframe-configure-tab"
        setShowSpinner={setIsIFrameLoading}
        showSpinner={isIFrameLoading}
        customRef={ref}
      />
    </div>
  );
};

export default MergeLeads;
