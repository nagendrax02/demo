import { trackError } from 'common/utils/experience/utils/track-error';
import { create } from 'zustand';
import { getKey, removeKey } from './utils';
import { IExternalAppEventHandler, ISubscribeEvent } from './event-handler.type';

const initialState: IExternalAppEventHandler<unknown> = {
  subscriptions: {},
  action: {},
  isListeningEvent: false,
  loadedScripts: {}
};

const useEventListener = create<IExternalAppEventHandler<unknown>>(() => ({
  ...initialState
}));

const deleteEvent = (eventName: string, uid: string): void => {
  useEventListener.setState((state) => removeKey(state.subscriptions, eventName, uid));
};

const subscribeExternalAppEvent = <T>(
  eventName: string,
  eventAction: (data: T) => void
): ISubscribeEvent => {
  const uid = getKey();
  useEventListener.setState((state) => ({
    subscriptions: {
      ...state.subscriptions,
      [eventName]: { ...(state.subscriptions?.[eventName] || {}), [uid]: eventAction }
    }
  }));

  return {
    remove: (): void => {
      deleteEvent(eventName, uid);
    }
  };
};

const publishExternalAppEvent = <T>(eventName: string, data: T): void => {
  try {
    const subscription = Object?.values(
      useEventListener.getState()?.subscriptions?.[eventName] || {}
    );

    subscription?.forEach((eventAction) => {
      if (typeof eventAction === 'function') {
        eventAction(data);
      }
    });
  } catch (error) {
    trackError(error);
  }
};

const getExternalAppAction = <T>(key: string): T => {
  return useEventListener.getState()?.action?.[key] as T;
};

const putExternalAppAction = <T>(key: string, value: T): void => {
  useEventListener.setState((state) => ({ action: { ...state.action, [key]: value } }));
};

const setExternalAppListener = (value: boolean): void => {
  useEventListener.setState(() => ({ isListeningEvent: value }));
};

const isListeningExternalAppEvents = (): boolean => {
  return useEventListener.getState()?.isListeningEvent;
};

const setLoadedScripts = (scriptId: string): void => {
  useEventListener.setState((state) => ({
    loadedScripts: { ...state.loadedScripts, [scriptId]: true }
  }));
};

const isScriptLoaded = (scriptId: string): boolean => {
  return useEventListener.getState()?.loadedScripts?.[scriptId] || false;
};

export {
  subscribeExternalAppEvent,
  publishExternalAppEvent,
  putExternalAppAction,
  getExternalAppAction,
  setExternalAppListener,
  isListeningExternalAppEvents,
  setLoadedScripts,
  isScriptLoaded
};
