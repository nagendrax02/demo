import { IListCreate, ListEvent } from './list-create-type';
import Iframe from 'common/component-lib/iframe';
import { useRef, useState } from 'react';
import useSmartViewStore, { setRefresh } from 'apps/smart-views/smartviews-store';
import useMarvinComponent from 'common/utils/marvin-helper';
import {
  EXTERNAL_FEATURE,
  ExternalComponentRoute,
  TabMode
} from 'src/apps/smart-views/components/external-components/constants';
import { generateConfigureTabDataToSend } from 'apps/smart-views/components/external-components/utils';
import { augmentTabData } from 'apps/smart-views/utils/utils';
import {
  getTabData,
  refreshGrid,
  skipAutoRefresh,
  useActiveTab,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { ISaveTabMessage } from 'apps/smart-views/components/external-components/external-components.types';
import {
  CreateListMode,
  IEditListConfig,
  LIST_TYPE_MAPPING,
  ListType
} from 'apps/smart-views/smartviews.types';
import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import SideModal from '@lsq/nextgen-preact/side-modal';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { ACTION } from 'apps/entity-details/constants';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { IListsSettingsConfigurations } from 'apps/smart-views/components/custom-tabs/manage-lists/manage-lists.types';

const LIST_MAPPING = {
  [HeaderAction.CreateList]: CreateListMode.Add,
  [HeaderAction.CreateEmptyList]: CreateListMode.Empty,
  [ACTION.ListEdit]: CreateListMode.Edit,
  [ACTION.ListAddMore]: CreateListMode.AddMore
};

const ListCreate = (props: IListCreate): JSX.Element => {
  const { show, setShow, selectedAction, records } = props;

  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const ref = useRef<HTMLIFrameElement | null>(null);
  const smartviewId = useSmartViewStore((state) => state.smartViewId);

  const activeTab = useActiveTab();
  const { tabSettings } = useSmartViewTab(activeTab);

  const tabDetails = useSmartViewStore((state) => state.rawTabData?.[activeTab]);

  const { showAlert } = useNotification();

  const isCustomTabTypeEnabled =
    useSmartViewStore((state) => state.commonTabSettings?.isCustomTabTypeEnabled) ?? false;

  const onSuccess = (): void => {
    skipAutoRefresh(false);
    refreshGrid(activeTab);
    setShow(false);
  };

  const handleReceivedMessage = (data: ISaveTabMessage): void => {
    if (data?.type === ListEvent.CreateList) {
      const isSuccess = data?.message?.isSuccessful;
      if (isSuccess) {
        onSuccess();
        let message = '';
        switch (selectedAction?.value) {
          case HeaderAction.CreateList:
          case HeaderAction.CreateEmptyList:
            message = `List '${data?.message?.listName}' created successfully`;
            break;
          case ACTION.ListEdit:
            message = `List '${data?.message?.listName}' updated successfully`;
            setRefresh();
            break;
          default:
            break;
        }
        showAlert({
          type: Type.SUCCESS,
          message: message
        });
      }
    } else if (data?.type === ListEvent.CloseList) {
      setShow(false);
    }
  };

  const getEditConfig = (): IEditListConfig => {
    const config = {
      listType: (LIST_TYPE_MAPPING[records?.ListType ?? ''] ||
        LIST_TYPE_MAPPING[ListType.STATIC]) as string,
      listID: records?.id ?? '',
      listName: records?.Name ?? ''
    };
    return config;
  };

  const isLeadTypeEnabled = (): boolean | undefined => {
    const settingInfo = getItem(StorageKey.Setting) as Record<string, string | object>;
    const listsConfiguration = settingInfo?.ListsConfiguration as IListsSettingsConfigurations;
    return (
      tabSettings?.isLeadTypeEnabled &&
      listsConfiguration?.TMP_EnableLeadTypeListRelatedChanges === '1'
    );
  };

  useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.ListCreate,
      payload: generateConfigureTabDataToSend({
        smartviewId,
        mode: TabMode.Edit,
        tabDetails: augmentTabData(tabDetails, getTabData(tabDetails?.Id)),
        isCustomTabTypeEnabled,
        createMode: LIST_MAPPING[selectedAction?.value ?? ''],
        editListConfig: getEditConfig(),
        isLeadTypeEnabled: isLeadTypeEnabled(),
        leadTypeInternalName: getTabData(tabDetails?.Id)?.leadTypeConfiguration?.[0]
          ?.LeadTypeInternalName
      })
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.listCreate
  });

  return (
    <SideModal show={show} setShow={setShow}>
      <SideModal.Body>
        <Iframe
          src={`${getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string}/?isSWLite=true&feature=${
            EXTERNAL_FEATURE.listCreate
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

export default ListCreate;
