import { subscribeExternalAppEvent } from '../../event-handler';

interface IBroadcastMessageEvent {
  data: unknown;
}

const subscribeToBroadcast = (event: MessageEvent): void => {
  subscribeExternalAppEvent(
    'broadcast-external-action',
    (broadcastMessageEvent: IBroadcastMessageEvent) => {
      if (event?.ports[0])
        event.ports[0].postMessage(broadcastMessageEvent?.data || broadcastMessageEvent);
    }
  );
};

export default subscribeToBroadcast;
