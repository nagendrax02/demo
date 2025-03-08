import Spinner from '@lsq/nextgen-preact/spinner';
import { useEffect } from 'react';
import { ExternalScriptState, useExternalScript } from 'apps/external-app/hooks/useExternalScript';
import useCasaHelperUtils from './utils';
import { ICasaHelperUtils } from './casa.types';
import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    ReactApp: { renderApp: (id: string) => void };
    casaHelperUtils: ICasaHelperUtils;
  }
}

const Casa = (): JSX.Element => {
  const state = useExternalScript(`${getEnvConfig(ENV_CONFIG.casaWeb) as string}/entry.js`);
  const casaHelperUtils = useCasaHelperUtils();

  useEffect(() => {
    if (state === ExternalScriptState.Ready) {
      if (window) {
        window.ReactApp.renderApp('casa-web');
        window.casaHelperUtils = casaHelperUtils;
      }
    }
  }, [casaHelperUtils, state]);

  return (
    <>
      {state !== ExternalScriptState.Ready ? (
        <Spinner />
      ) : (
        <div id="casa-web">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default Casa;
