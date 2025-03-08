import { publishExternalAppEvent } from 'src/apps/external-app/event-handler';

const broadcastMessage = (event: MessageEvent): void => {
  publishExternalAppEvent('lsq-marvin-broadcast-message', {
    data: event?.data?.payload as unknown
  });
};

export default broadcastMessage;
