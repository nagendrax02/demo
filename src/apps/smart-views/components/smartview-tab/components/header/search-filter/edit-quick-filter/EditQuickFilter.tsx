import { useRef, useState } from 'react';
import SideModal from '@lsq/nextgen-preact/side-modal';

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
  setQuickFilterAndAdvancedSearch,
  setResetQuickFilterOptions,
  useActiveTab,
  useQuickFilter
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { ISaveTabMessage } from 'apps/smart-views/components/external-components/external-components.types';
import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import Iframe from 'common/component-lib/iframe';
import { IEditQuickFilter } from '../quick-filter/quick-filter.types';
import { persistQuickFilterSelected } from '../utils';
import { QuickFilterEvents } from '../search-filter.type';
import { SEARCH_RESULTS } from '../quick-filter/constant';

const EditQuickFilter = (props: IEditQuickFilter): JSX.Element => {
  const { itemSelected, showEditModal, setShowEditModal, leadTypeInternalName } = props;
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const ref = useRef<HTMLIFrameElement | null>(null);
  const smartviewId = useSmartViewStore((state) => state.smartViewId);
  const activeTab = useActiveTab();
  const tabDetails = useSmartViewStore((state) => state.rawTabData?.[activeTab]);
  const isCustomTabTypeEnabled =
    useSmartViewStore((state) => state.commonTabSettings?.isCustomTabTypeEnabled) ?? false;
  const quickFilter = useQuickFilter(activeTab);

  const processQuickFilterMessage = ({
    quickFilterId,
    quickFilterName,
    quickFilterValue,
    canCloseModal = true,
    eventType
  }: {
    quickFilterName: string;
    quickFilterValue: string;
    quickFilterId: string;
    canCloseModal?: boolean;
    eventType: QuickFilterEvents;
  }): void => {
    if (canCloseModal) {
      setShowEditModal(false);
    }
    setResetQuickFilterOptions(tabDetails?.Id);

    if (
      [
        QuickFilterEvents.SetUpdateAdvancedSearchCondition,
        QuickFilterEvents.UpdateQuickFilterName
      ].includes(eventType) &&
      quickFilter?.ID !== quickFilterId
    ) {
      return;
    }

    setQuickFilterAndAdvancedSearch(activeTab, quickFilterValue, {
      ID: quickFilterId,
      Name: quickFilterName,
      Definition: quickFilterValue
    });

    persistQuickFilterSelected({
      Definition: quickFilterValue,
      Name: quickFilterName,
      ID: quickFilterId
    });
  };

  // eslint-disable-next-line complexity
  const handleReceivedMessage = (data: ISaveTabMessage): void => {
    const quickFilterName = data?.message?.leadQuickFilter?.quickFilterName || '';
    const quickFilterValue = data?.message?.leadQuickFilter?.quickFilterValue || '';
    const quickFilterId = data?.message?.leadQuickFilter?.quickFilterId || '';

    switch (data?.type) {
      case QuickFilterEvents.SetNewLeadQuickFilter:
      case QuickFilterEvents.SetUpdateAdvancedSearchCondition:
        processQuickFilterMessage({
          quickFilterName,
          quickFilterValue,
          quickFilterId,
          eventType: data.type
        });
        break;
      case QuickFilterEvents.UpdateQuickFilterName:
        processQuickFilterMessage({
          quickFilterName,
          quickFilterValue,
          quickFilterId,
          canCloseModal: false,
          eventType: data.type
        });
        break;

      case QuickFilterEvents.SetShowResult:
        processQuickFilterMessage({
          quickFilterName: quickFilterName || SEARCH_RESULTS.NAME,
          quickFilterValue,
          quickFilterId: quickFilterId || SEARCH_RESULTS.ID,
          eventType: data.type
        });
        break;
      default:
        break;
    }
  };

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.AdvancedSearchTab,
      payload: generateConfigureTabDataToSend({
        smartviewId,
        mode: TabMode.Edit,
        // augmentTabData is used to generate latest tab data of format ITabResponse
        tabDetails: augmentTabData(tabDetails, getTabData(tabDetails?.Id), itemSelected),
        isCustomTabTypeEnabled,
        LeadQuickSelectedFilter: itemSelected,
        leadTypeInternalName: leadTypeInternalName
      })
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.configureTab
  });

  return (
    <SideModal show={showEditModal} setShow={setShowEditModal}>
      <SideModal.Body>
        <Iframe
          src={`${getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string}/?isSWLite=true&feature=${
            EXTERNAL_FEATURE.configureTab
          }`}
          width={'100%'}
          height={'100%'}
          id="iframe-configure-tab"
          setShowSpinner={setIsIFrameLoading}
          showSpinner={isIFrameLoading}
          customRef={ref}></Iframe>
      </SideModal.Body>
    </SideModal>
  );
};

export default EditQuickFilter;
