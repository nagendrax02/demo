import { trackError } from 'common/utils/experience/utils/track-error';
import { useRef, useState } from 'react';
import { getLeadRepresentationName } from 'apps/smart-views/smartviews-store';
import Iframe from 'common/component-lib/iframe';
import SideModal from '@lsq/nextgen-preact/side-modal';
import useMarvinComponent from 'common/utils/marvin-helper';
import { EXTERNAL_FEATURE, ExternalComponentRoute } from '../constants';
import { TabType } from 'apps/smart-views/constants/constants';
import { ENV_CONFIG } from 'common/constants';
import { getEnvConfig } from 'common/utils/helpers';
import { getTabData } from '../../smartview-tab/smartview-tab.store';

export interface IEntityImport {
  show: boolean;
  setShow: (show: boolean) => void;
  tabId: string;
}

const EntityImport = (props: IEntityImport): JSX.Element => {
  const { show, setShow, tabId } = props;
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const ref = useRef<HTMLIFrameElement | null>(null);
  const tabDetails = getTabData(tabId);

  const handleReceivedMessage = async (data: { Type: string; action: string }): Promise<void> => {
    try {
      if (data?.Type === 'entity-import' && data?.action === 'close') {
        setShow(false);
      }
    } catch (error) {
      trackError(error);
    }
  };

  const getRepresentationName = (): string => {
    const representationName = {
      [TabType.Lead]: getLeadRepresentationName()?.SingularName,
      [TabType.Activity]: 'Activities',
      [TabType.Account]: tabDetails?.representationName?.SingularName
    };
    return (representationName[tabDetails?.type] ||
      tabDetails?.representationName?.SingularName) as string;
  };

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.ImportEntity,
      payload: {
        tabType: tabDetails?.type,
        representationName: getRepresentationName(),
        entityCode: tabDetails?.entityCode,
        leadTypeConfig: tabDetails?.leadTypeConfiguration
      }
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.entityImport
  });

  return (
    <SideModal show={show} setShow={setShow}>
      <SideModal.Body>
        <Iframe
          src={`${getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string}/?isSWLite=true&feature=${
            EXTERNAL_FEATURE.entityImport
          }`}
          width={'100%'}
          height={'100%'}
          id="iframe-entity-import"
          setShowSpinner={setIsIFrameLoading}
          showSpinner={isIFrameLoading}
          customRef={ref}></Iframe>
      </SideModal.Body>
    </SideModal>
  );
};

export default EntityImport;
