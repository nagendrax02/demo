import { trackError } from 'common/utils/experience/utils/track-error';
import { Link } from 'wouter';
import { INavItem, NavPosition } from 'apps/header/header.types';
import useHeaderStore from 'apps/header/header.store';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import IconHandler from 'apps/header/components/IconHandler';
import styles from '../../../styles.module.css';
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  getExternalAppHandler,
  getExternalAppPromise,
  getExternalAppVisibilityCheck
} from 'common/utils/helpers/external-app';
import {
  addObserverToNavItem,
  getNavItemId,
  isCarter
} from 'apps/header/components/web-header/utils';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { APPS_WITHOUT_DISPLAY_CHECK } from 'apps/header/constants';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface INavItemProps {
  navItem: INavItem;
  showDisplayName?: boolean;
  hideTooltip?: boolean;
  customStyleClass?: string;
}

const NavItem = (props: INavItemProps): JSX.Element => {
  const {
    activeNavItemName,
    setActiveNavItemName,
    removeNavItem,
    externalAppsWithOnRenderRegistered
  } = useHeaderStore((state) => ({
    activeNavItemName: state.activeNavItemName,
    setActiveNavItemName: state.setActiveNavItemName,
    removeNavItem: state.removeNavItem,
    externalAppsWithOnRenderRegistered: state.externalAppsWithOnRenderRegistered
  }));
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const ref = useRef<HTMLAnchorElement>(null);

  const { navItem, showDisplayName, hideTooltip, customStyleClass } = props;

  const onNavItemClick = (): void => {
    if (isCarter(navItem?.Name)) return;
    setActiveNavItemName(navItem.Name);
  };

  useEffect(() => {
    const verifyIfScriptLoaded = async (): Promise<void> => {
      try {
        await getExternalAppPromise(navItem?.Name)?.promise;
      } catch (error) {
        trackError(error);
      } finally {
        setIsScriptLoading(false);
      }
    };
    const observer = addObserverToNavItem(ref);
    verifyIfScriptLoaded();

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (externalAppsWithOnRenderRegistered[navItem.Name]) {
      getExternalAppHandler(navItem?.Name)?.onRender?.(
        ref?.current,
        NavPosition.LEFT,
        getNavItemId(navItem)
      );
      getExternalAppVisibilityCheck(navItem?.Name)?.resolve?.('');
      if (ref?.current?.style?.display === 'none' && !APPS_WITHOUT_DISPLAY_CHECK[navItem.Name]) {
        removeNavItem(navItem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalAppsWithOnRenderRegistered]);

  const Icon = useMemo((): JSX.Element | null => {
    if (isScriptLoading) {
      return <Shimmer height="32px" width="32px" />;
    }

    return navItem?.IsExternal &&
      typeof getExternalAppHandler(navItem?.Name)?.onRender === 'function' ? null : (
      <>
        <IconHandler name={navItem.DisplayConfig.Icon} />
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoading, getExternalAppHandler(navItem?.Name)?.onRender]);

  const getRoutePath = (): string => {
    return isCarter(navItem?.Name) ? '' : navItem.RouteConfig.RoutePath;
  };

  const renderItem = (
    <Link href={getRoutePath()} onClick={onNavItemClick}>
      <a
        ref={ref}
        className={`${styles.nav_item} ${
          activeNavItemName === navItem.Name ? styles.active_nav_item : ''
        } ${customStyleClass}`}
        id={getNavItemId(navItem)}
        title={hideTooltip ? navItem.DisplayConfig.DisplayName : ''}>
        {Icon}
        {showDisplayName ? <span>{navItem.DisplayConfig.DisplayName}</span> : null}
      </a>
    </Link>
  );

  return (
    <>
      {hideTooltip ? (
        renderItem
      ) : (
        <Tooltip
          content={navItem.DisplayConfig.DisplayName}
          placement={Placement.Horizontal}
          theme={Theme.Dark}
          trigger={[Trigger.Hover]}>
          {renderItem}
        </Tooltip>
      )}
    </>
  );
};

NavItem.defaultProps = {
  showDisplayName: false,
  hideTooltip: false,
  customStyleClass: ''
};

export default NavItem;
