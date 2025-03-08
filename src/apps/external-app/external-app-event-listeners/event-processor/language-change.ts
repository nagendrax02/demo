import { subscribeExternalAppEvent } from 'apps/external-app/event-handler';

interface ILanguageChange {
  data: unknown;
}

const languageChangeProcessor = (event: MessageEvent): void => {
  subscribeExternalAppEvent(
    'lsq-marvin-language-change',
    (languageChangeEvent: ILanguageChange) => {
      if (event.ports[0]) event.ports[0].postMessage(languageChangeEvent?.data);
    }
  );
};

export default languageChangeProcessor;
