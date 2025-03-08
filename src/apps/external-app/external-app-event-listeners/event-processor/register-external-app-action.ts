import { trackError } from 'common/utils/experience/utils/track-error';
import {
  publishExternalAppEvent,
  subscribeExternalAppEvent
} from 'src/apps/external-app/event-handler';
import {
  getExternalAppAction,
  putExternalAppAction
} from '../../event-handler/event-handler.store';
import { safeParseJson } from 'src/common/utils/helpers';

interface IActionSubscription {
  appId: string;
  workAreas?: string;
}
interface ITriggerAppActionEvent {
  data: {
    appId: string;
  };
}

const actionRegistrationProcessor = (event: MessageEvent): void => {
  try {
    const subscriptions =
      (getExternalAppAction('subscription') as Record<string, IActionSubscription>) || {};

    const payload = safeParseJson(event?.data?.payload) as IActionSubscription;

    subscriptions[payload?.appId] = payload;
    putExternalAppAction('subscription', subscriptions);

    subscribeExternalAppEvent(
      'lsq-marvin-trigger-app-action',
      (triggerAppActionEvent: ITriggerAppActionEvent) => {
        if (event.ports[0] && triggerAppActionEvent.data.appId === payload.appId) {
          event.ports[0].postMessage(triggerAppActionEvent);
        }
      }
    );
  } catch (err) {
    trackError(err);
  }
};

export const actionRegistrationResponse = (event: MessageEvent): void => {
  publishExternalAppEvent('action-registration-response', event.data.payload);
};

export default actionRegistrationProcessor;
