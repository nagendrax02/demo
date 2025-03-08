import { useRef, useState } from 'react';

import useMarvinComponent from 'common/utils/marvin-helper';
import {
  EXTERNAL_FEATURE,
  ExternalComponentRoute,
  TabMode
} from 'apps/smart-views/components/external-components/constants';
import useSmartViewStore from 'apps/smart-views/smartviews-store';
import { generateConfigureTabDataToSend } from 'apps/smart-views/components/external-components/utils';
import { augmentTabData } from 'apps/smart-views/utils/utils';
import {
  getTabData,
  updateAdvancedSearchValue,
  useActiveTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { ISaveTabMessage } from 'apps/smart-views/components/external-components/external-components.types';

import Iframe from 'common/component-lib/iframe';
import { IAdvanceSearch } from '../quick-filter/quick-filter.types';
import { QuickFilterEvents } from '../search-filter.type';
import SideModal from '@lsq/nextgen-preact/side-modal';
import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';

const ManageEntityAdvSearchModal = (props: IAdvanceSearch): JSX.Element => {
  const { showModal, setShowModal } = props;
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const ref = useRef<HTMLIFrameElement | null>(null);
  const smartviewId = useSmartViewStore((state) => state.smartViewId);
  const activeTab = useActiveTab();
  const tabDetails = useSmartViewStore((state) => state.rawTabData?.[activeTab]);

  const processAdvanceSearchMessage = (currentAdvancedSearch: string): void => {
    updateAdvancedSearchValue(activeTab, currentAdvancedSearch);
    setShowModal(false);
  };

  const handleReceivedMessage = (data: ISaveTabMessage): void => {
    const currentAdvancedSearch = data?.message?.leadQuickFilter?.quickFilterValue ?? '';

    if (data?.type === QuickFilterEvents.SetShowResult) {
      processAdvanceSearchMessage(currentAdvancedSearch);
    }
  };

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.ManageEntityAdvanceSearch,
      payload: generateConfigureTabDataToSend({
        smartviewId,
        // tabmode.edit is being used because in case of manage activity we have a default advanced search applied. So if we change we basically edit it.
        mode: TabMode.Edit,
        // augmentTabData is used to generate latest tab data of format ITabResponse
        tabDetails: augmentTabData(tabDetails, getTabData(tabDetails?.Id)),
        isCustomTabTypeEnabled: false
      })
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.manageEntityAdvSearch
  });

  return (
    <SideModal show={showModal} setShow={setShowModal}>
      <SideModal.Body>
        <Iframe
          src={`${getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string}/?isSWLite=true&feature=${
            EXTERNAL_FEATURE.manageEntityAdvSearch
          }`}
          width={'100%'}
          height={'100%'}
          id="iframe-manage-entity-adv-search"
          setShowSpinner={setIsIFrameLoading}
          showSpinner={isIFrameLoading}
          customRef={ref}
        />
      </SideModal.Body>
    </SideModal>
  );
};

export default ManageEntityAdvSearchModal;
