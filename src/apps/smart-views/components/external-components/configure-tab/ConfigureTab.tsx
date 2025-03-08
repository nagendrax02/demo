import { trackError } from 'common/utils/experience/utils/track-error';
import SideModal from '@lsq/nextgen-preact/side-modal';
import Iframe from 'common/component-lib/iframe';
import { useRef, useState } from 'react';
import useMarvinComponent from 'common/utils/marvin-helper';
import { EXTERNAL_FEATURE, ExternalComponentRoute, TabMode, messageType } from '../constants';
import { generateConfigureTabDataToSend } from '../utils';
import useSmartViewStore, {
  addNewTab,
  setActiveTabId,
  updateCustomTab
} from 'apps/smart-views/smartviews-store';
import { ISaveTabMessage } from '../external-components.types';
import { getEnvConfig, sleep } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { augmentTabData } from 'apps/smart-views/utils/utils';
import { getTabData, setActiveTab } from '../../smartview-tab/smartview-tab.store';

export interface IConfigureTab {
  show: boolean;
  onClose: (show: boolean) => void;
  isEdit?: boolean;
}

const ConfigureTab = (props: IConfigureTab): JSX.Element => {
  const { show, onClose, isEdit } = props;
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const ref = useRef<HTMLIFrameElement | null>(null);
  const smartviewId = useSmartViewStore((state) => state.smartViewId);
  const activeTabId = useSmartViewStore((state) => state.activeTabId);
  const tabDetails = useSmartViewStore((state) => state.rawTabData?.[activeTabId]);
  const isCustomTabTypeEnabled =
    useSmartViewStore((state) => state.commonTabSettings?.isCustomTabTypeEnabled) || false;
  const isLeadTypeEnabled =
    useSmartViewStore((state) => state.commonTabSettings?.isLeadTypeEnabled) || false;

  const onTabSave = (tabData: ITabResponse): void => {
    if (isEdit) {
      updateCustomTab(tabData);
    } else {
      if (tabData?.TabConfiguration) {
        tabData.TabConfiguration.IsMarvinTab = true;
      }
      addNewTab(tabData);
      setActiveTab(tabData.Id);
      setActiveTabId(tabData?.Id);
    }
  };

  const handleSaveTabApiMessage = async (data: ISaveTabMessage): Promise<void> => {
    if (data?.type === messageType.SaveTabApi) {
      // pausing execution for 2000ms to wait for success message to complete
      await sleep(2000);
      if (data?.message?.isSuccessful) {
        const tabData = data?.message?.tabData;
        // get latest tabData and update store
        if (tabData) {
          onTabSave(tabData);
        }
      }
      onClose(false);
    }
  };

  const handleReceivedMessage = async (data: ISaveTabMessage): Promise<void> => {
    try {
      await handleSaveTabApiMessage(data);
    } catch (error) {
      trackError(error);
    }
  };

  const getLatestRawTabData = (): ITabResponse => {
    const latestTabData = getTabData(tabDetails?.Id);
    return latestTabData ? augmentTabData(tabDetails, latestTabData) : tabDetails;
  };

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.ConfigureTab,
      payload: generateConfigureTabDataToSend({
        smartviewId,
        mode: isEdit ? TabMode.Edit : TabMode.Add,
        // augmentTabData is used to generate latest tab data of format ITabResponse
        tabDetails: isEdit ? getLatestRawTabData() : undefined,
        isCustomTabTypeEnabled,
        isLeadTypeEnabled
      })
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.configureTab
  });

  return (
    <SideModal show={show} setShow={onClose}>
      <SideModal.Body>
        <>
          <Iframe
            src={`${
              getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string
            }/?isSWLite=true&feature=${EXTERNAL_FEATURE.configureTab}`}
            width={'100%'}
            height={'100%'}
            id="iframe-configure-tab"
            setShowSpinner={setIsIFrameLoading}
            showSpinner={isIFrameLoading}
            customRef={ref}></Iframe>
        </>
      </SideModal.Body>
    </SideModal>
  );
};

ConfigureTab.defaultProps = {
  isEdit: false
};

export default ConfigureTab;
