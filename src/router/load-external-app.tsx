import { ExternalAppLoader, ExternalAppWithSubMenu } from 'apps/external-app/components';
import { getRoutePathToAppMap } from './utils';
import FeatureRestriction from 'common/utils/feature-restriction';
import styles from './router.module.css';
import { HEADER_FEATURE_RESTRICTION_MAP, HeaderModules } from '../apps/header/constants';
import AccessDenied from 'common/component-lib/file-library/components/access-denied';
import Spinner from '@lsq/nextgen-preact/spinner';
import CustomMenu from 'apps/external-app/custom-menu';

const loadExternalApp = (route: string): JSX.Element | null => {
  const routePathToApp = getRoutePathToAppMap();
  const appConfig = routePathToApp[route?.toLowerCase()];

  const getExternalAppElement = (): JSX.Element | null => {
    let externalAppElement: JSX.Element | null = null;

    if (appConfig?.Name === HeaderModules.CustomMenu) {
      externalAppElement = <CustomMenu />;
    } else if (appConfig?.HasDynamicChildren || appConfig?.ChildConfig?.IsDynamic) {
      // External apps with sub-menu to load
      externalAppElement = <ExternalAppWithSubMenu appConfig={appConfig} />;
    } else if (appConfig?.IsExternal) {
      // External apps with just iframe link to load
      externalAppElement = <ExternalAppLoader appConfig={appConfig} />;
    }

    if (externalAppElement) {
      const featureRestrictionConfig = HEADER_FEATURE_RESTRICTION_MAP?.[appConfig?.Name];
      if (featureRestrictionConfig) {
        return (
          <FeatureRestriction
            actionName={featureRestrictionConfig?.actionName}
            moduleName={featureRestrictionConfig?.moduleName}
            callerSource={featureRestrictionConfig?.callerSource}
            placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
            fallbackElement={<AccessDenied />}>
            {externalAppElement}
          </FeatureRestriction>
        );
      }
      return externalAppElement;
    }
    return null;
  };

  return getExternalAppElement() || null;
};

export default loadExternalApp;
