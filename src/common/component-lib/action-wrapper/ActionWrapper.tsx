import { lazy, Suspense } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { IActionWrapper } from './action-wrapper.types';
import { Theme } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const ActionWrapper = (props: IActionWrapper): JSX.Element => {
  const {
    children,
    action,
    menuKey,
    id,
    onMenuItemSelect,
    handleMenuClose,
    menuDimension,
    tooltipTheme,
    customMenuStyleClass
  } = props;

  if (action?.subMenu?.length) {
    return (
      <Suspense fallback={<></>}>
        <ActionMenu
          actions={action?.subMenu}
          menuKey={menuKey}
          onSelect={onMenuItemSelect}
          handleMenuClose={handleMenuClose}
          menuDimension={menuDimension}
          customStyleClass={customMenuStyleClass}>
          <div data-testid={`action-menu-${id}`}> {children}</div>
        </ActionMenu>
      </Suspense>
    );
  }
  return (
    <>
      {action?.toolTip ? (
        <Suspense fallback={<></>}>
          <Tooltip
            content={action?.toolTip}
            placement={Placement.Vertical}
            theme={tooltipTheme ?? Theme.Light}
            trigger={[Trigger.Hover]}>
            <div data-testid={`action-toolTip-${id}`}>{children}</div>
          </Tooltip>
        </Suspense>
      ) : (
        children
      )}
    </>
  );
};

ActionWrapper.defaultProps = {
  toolTip: undefined,
  subMenu: undefined
};

export default ActionWrapper;
