import { produce } from 'immer';
import { getRawTabData, getSmartviewId, setRawTabData } from '../../smartviews-store';
import { ACTIONS, TYPES } from './constants';
import { IActionHandler, IMessageData } from './custom-type-tab.types';
import { ITabResponse } from '../../smartviews.types';
import { updateSVMetadataCache } from '../../utils/utils';
import { CallerSource, httpPut, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';

const postMessageToIframe = (iframe: HTMLIFrameElement | null, data: IMessageData): void => {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(data, new URL(iframe.src).origin);
};

const updateRawTabData = async (tabData: ITabResponse): Promise<void> => {
  setRawTabData(tabData.Id, tabData);
  updateSVMetadataCache(tabData);
  httpPut({
    path: API_ROUTES.smartviews.updateTab,
    module: Module.SmartViews,
    body: {
      SmartviewId: getSmartviewId(),
      Tab: tabData
    },
    callerSource: CallerSource.SmartViews
  });
};

const actionHandlerMap = {
  [ACTIONS.INCOMING.INITIAL_DATA_REQUEST]: ({ tabData, iframeRef }: IActionHandler): void => {
    const advancedSearch = tabData.TabContentConfiguration.FetchCriteria.AdvancedSearchText;
    postMessageToIframe(iframeRef.current, {
      type: TYPES.OUTGOING.SMARTVIEWS_CONTAINER_MESSAGE,
      action: ACTIONS.OUTGOING.SET_INITIAL_CUSTOM_TAB_DATA,
      payLoad: {
        AdvancedSearchJSON: advancedSearch
      }
    });
  },
  [ACTIONS.INCOMING.OPEN_POPUP]: ({ payload, handlePopUpAction }: IActionHandler): void => {
    handlePopUpAction?.(payload?.URL ?? '', true, payload?.PopupStyles ?? '');
  },
  [ACTIONS.INCOMING.CLOSE_POPUP]: ({ handlePopUpAction }: IActionHandler): void => {
    handlePopUpAction?.('', false, '');
  },
  [ACTIONS.INCOMING.POST_TO_GRID]: ({ payload, iframeRef }: IActionHandler): void => {
    postMessageToIframe(iframeRef.current, {
      type: TYPES.OUTGOING.SMARTVIEWS_CONTAINER_MESSAGE,
      action: ACTIONS.OUTGOING.CUSTOM_TAB_POPUP_MESSAGE,
      payLoad: payload
    });
  },
  [ACTIONS.INCOMING.SET_ADVANCED_SEARCH]: ({ payload, tabData }: IActionHandler): void => {
    if (tabData?.TabContentConfiguration?.FetchCriteria) {
      const updatedTabData = produce(tabData, (draft) => {
        draft.TabContentConfiguration.FetchCriteria.AdvancedSearchText =
          payload.AdvancedSearchJSON ?? '';
        draft.TabContentConfiguration.FetchCriteria.AdvancedSearchText_English =
          payload.AdvancedSearchText ?? '';
      });
      updateRawTabData(updatedTabData);
    }
  },
  [ACTIONS.INCOMING.SET_RECORD_COUNT]: ({ payload, tabData }: IActionHandler): void => {
    const updatedTabData = produce(tabData, (draft) => {
      draft.Count = payload.count ?? 0;
    });
    updateRawTabData(updatedTabData);
  }
};

export const handleOnMessage = ({
  event,
  tabId,
  gridIFrameRef,
  popupIFrameRef,
  handlePopUpAction
}: {
  event: MessageEvent;
  tabId: string;
  gridIFrameRef: React.RefObject<HTMLIFrameElement>;
  popupIFrameRef: React.RefObject<HTMLIFrameElement>;
  handlePopUpAction: (url: string, open: boolean, styles: string) => void;
}): void => {
  if (!event?.data?.type || !event?.data?.action) {
    return;
  }

  const tabData = getRawTabData(tabId);
  const eventData = event?.data as IMessageData;
  const actionHandler = actionHandlerMap[eventData.action];

  if (
    eventData.type === TYPES.INCOMING.SMARTVIEWS_GRID_MESSAGE ||
    eventData.action === ACTIONS.INCOMING.POST_TO_GRID
  ) {
    actionHandler?.({
      tabData,
      iframeRef: gridIFrameRef,
      payload: eventData.payLoad,
      handlePopUpAction
    });
  } else if (eventData.type === TYPES.INCOMING.SMARTVIEWS_POPUP_MESSAGE) {
    actionHandler?.({
      tabData,
      iframeRef: popupIFrameRef,
      handlePopUpAction,
      payload: eventData.payLoad
    });
  }
};
