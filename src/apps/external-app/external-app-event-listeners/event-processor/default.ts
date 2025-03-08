import { trackError } from 'common/utils/experience/utils/track-error';
const defaultProcessor = (event: MessageEvent): void => {
  trackError('external-app-event-processor: no event handlers found for ', event.data.type);
};

export default defaultProcessor;
