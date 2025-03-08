import { subscribeExternalAppEvent } from '../../event-handler';
interface IThemeChangeEvent {
  data: unknown;
}
const themeChangeProcessor = (event: MessageEvent): void => {
  subscribeExternalAppEvent('lsq-marvin-theme-change', (themeChangeEvent: IThemeChangeEvent) => {
    if (event?.ports[0]) event?.ports[0].postMessage(themeChangeEvent.data);
  });
};

export default themeChangeProcessor;
