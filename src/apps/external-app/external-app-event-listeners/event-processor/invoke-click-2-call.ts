import { publishExternalAppEvent } from 'src/apps/external-app/event-handler';

const invokeClick2Call = (event: MessageEvent): void => {
  if (event?.data?.payload) {
    publishExternalAppEvent('lsq-marvin-click-2-call', event.data.payload);
  }
};

export default invokeClick2Call;
