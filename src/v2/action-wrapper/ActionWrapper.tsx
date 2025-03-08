import { lazy, useState } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import ActionMenu from '@lsq/nextgen-preact/v2/action-menu';
import { IActionWrapper } from './action-wrapper.types';
import { Theme } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const ActionWrapper = (props: IActionWrapper): JSX.Element => {
  const { children, action, onMenuItemSelect, tooltipTheme } = props;
  const [open, setOpen] = useState(false);

  if (action?.subMenu?.length) {
    return (
      <ActionMenu
        open={open}
        onOpenChange={setOpen}
        actions={action?.subMenu}
        onSelection={onMenuItemSelect}>
        {children}
      </ActionMenu>
    );
  }
  return (
    <>
      {action?.toolTip ? (
        <Tooltip
          content={action?.toolTip}
          placement={Placement.Vertical}
          theme={tooltipTheme ?? Theme.Light}
          trigger={[Trigger.Hover]}>
          {children}
        </Tooltip>
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
