import { subscribeExternalAppEvent } from 'src/apps/external-app/event-handler';

const onSignOutProcessor = (event: MessageEvent): void => {
  subscribeExternalAppEvent('lsq-marvin-sign-out', (signOutEvent) => {
    if (event.ports[0]) event.ports[0].postMessage(signOutEvent);
  });
};

export default onSignOutProcessor;
