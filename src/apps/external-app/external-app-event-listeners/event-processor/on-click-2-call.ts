import { subscribeExternalAppEvent } from 'src/apps/external-app/event-handler';
import { IClick2Call } from '../event-listener.types';

export const onClick2CallProcessor = (event: MessageEvent): void => {
  //TODO: remove temp logs
  console.log('scriptTesting onClick2CallProcessor', performance?.now());
  subscribeExternalAppEvent('lsq-marvin-click-2-call', (click2CallEvent: IClick2Call): void => {
    if (event.ports[0]) event.ports[0].postMessage(click2CallEvent);
  });
};
