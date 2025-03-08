import { trackError } from 'common/utils/experience/utils/track-error';
import { subscribeExternalAppEvent } from 'src/apps/external-app/event-handler';
interface IOnBroadCastMessageReceived {
  data: {
    uniqueId: unknown;
  };
}

const onBroadCastMessageReceived = (event: MessageEvent): void => {
  const port2 = event.ports[0];

  const unsubscribe = subscribeExternalAppEvent(
    'lsq-marvin-broadcast-message',

    (broadcastMessageEvent: IOnBroadCastMessageReceived) => {
      if (event.data.payload !== broadcastMessageEvent.data.uniqueId)
        if (port2) port2.postMessage(broadcastMessageEvent && broadcastMessageEvent.data);
    }
  ).remove;

  port2.onmessage = (port2MsgEvent): void => {
    try {
      console.log('onBroadCastMessageReceived : ', port2MsgEvent);
      if (port2MsgEvent?.data && typeof port2MsgEvent?.data !== 'string')
        console.log('unsupported command received :', port2MsgEvent.data);

      switch (port2MsgEvent?.data?.toUpperCase()) {
        case 'UNSUBSCRIBE':
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
          break;
      }
    } catch (ex) {
      trackError('Exception occurred in onBroadCastMessageReceived :', ex);
    }
  };
};

export default onBroadCastMessageReceived;
