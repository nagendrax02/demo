import { useEffect, useState } from 'react';

export enum ExternalScriptState {
  Loading = 'loading',
  Idle = 'idle',
  Ready = 'ready',
  Error = 'error'
}

export const useExternalScript = (url: string): string => {
  const [state, setState] = useState(url ? ExternalScriptState.Loading : ExternalScriptState.Idle);

  useEffect(() => {
    if (!url) {
      setState(ExternalScriptState.Idle);
      return;
    }

    let script = document.querySelector(`script[src="${url}"]`);

    const handleScript = (e: { type: string }): void => {
      setState(e.type === 'load' ? ExternalScriptState.Ready : ExternalScriptState.Error);
    };

    try {
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/javascript');
        script.setAttribute('src', url);
        script.setAttribute('async', '');
        document.body.appendChild(script);
        script.addEventListener('load', handleScript);
        script.addEventListener('error', handleScript);
      }
      script.addEventListener('load', handleScript);
      script.addEventListener('error', handleScript);
    } catch (error) {
      console.log('Failed to inject external apps script', error);
    }

    return () => {
      script?.removeEventListener('load', handleScript);
      script?.removeEventListener('error', handleScript);
    };
  }, [url]);

  return state;
};
