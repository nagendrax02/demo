import { trackError } from 'common/utils/experience/utils/track-error';
import { isScriptLoaded, setLoadedScripts } from '../event-handler/event-handler.store';
interface ILoadScript {
  id: string;
  url: string;
  onLoad?: () => void;
  onError?: () => void;
  delay?: number;
  loadAsync?: boolean;
}

const appendScript = ({ url, onError, onLoad, loadAsync }: ILoadScript): void => {
  try {
    const element: HTMLScriptElement = document.createElement('script');
    element.src = url;
    element.type = 'text/javascript';
    if (loadAsync) {
      element.async = true;
    } else {
      element.defer = true;
    }
    element.onload = (): void => {
      if (onLoad) onLoad();
    };
    element.onerror = (): void => {
      if (onError) onError();
    };
    document?.head?.appendChild(element);
  } catch (error) {
    trackError(error);
  }
};

const loadScript = ({ id, url, onError, onLoad, delay, loadAsync }: ILoadScript): void => {
  if (isScriptLoaded(id)) {
    if (onLoad) onLoad();
    return;
  }
  setLoadedScripts(id);
  try {
    if (delay) {
      setTimeout(() => {
        appendScript({ id, url, onError, onLoad, loadAsync });
      }, delay);
    } else {
      appendScript({ id, url, onError, onLoad, loadAsync });
    }
  } catch (error) {
    trackError(error);
  }
};

const scriptLoader = ({ id, url, onError, onLoad, delay, loadAsync }: ILoadScript): void => {
  try {
    if (!url) {
      throw new Error('Script url is not present');
    }

    loadScript({ id, url, onLoad, onError, delay, loadAsync });
  } catch (error) {
    trackError(error);
  }
};

export default scriptLoader;
