import { render } from 'preact';
require('./style/normalize.css');
import Layout from './layout';
import ErrorBoundary from 'common/component-lib/error-boundary';
import { isMiP } from 'common/utils/helpers/helpers';
import { ThemeProvider } from '@lsq/nextgen-preact/v2/stylesmanager';
import MipNavigation from 'common/component-lib/mip-navigation';
require('@lsq/nextgen-preact/v2/stylesmanager/global.min.css');

render(
  <ThemeProvider>
    <>
      {isMiP() ? (
        <ErrorBoundary module="LayoutMiPMenu" key="LayoutMiPMenu" fallback={<></>}>
          <MipNavigation />
        </ErrorBoundary>
      ) : null}
      <ErrorBoundary module="Layout" key="Layout">
        <Layout />
      </ErrorBoundary>
    </>
  </ThemeProvider>,
  document.getElementById('marvin-app-root') as HTMLElement
);
