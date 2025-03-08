import { subscribeExternalAppEvent } from '../../event-handler';

interface IAppLoadEvent {
  data: unknown;
}

const subscribeToExternalAppLoad = (event: MessageEvent): void => {
  subscribeExternalAppEvent('lsq-marvin-external-app-load', (appLoadEvent: IAppLoadEvent) => {
    const key = 'active_iframe_url';
    window[`${key}`] = (appLoadEvent?.data as Record<string, unknown>)?.url;
    if (event?.ports[0]) event.ports[0].postMessage(appLoadEvent?.data || appLoadEvent);
  });
};

export default subscribeToExternalAppLoad;
