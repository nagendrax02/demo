import { lazy } from 'react';
import { useMiPHeader } from '../mip-header.store';
import { ActionId } from '../mip-header.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
const SwitchBack = withSuspense(lazy(() => import('../switch-back/SwitchBack')));

const ActionHandler = (): JSX.Element | null => {
  const { clickedAction, module } = useMiPHeader((state) => ({
    clickedAction: state.clickedAction,
    module: state.module
  }));

  return (
    <>{module ? <>{clickedAction === ActionId.SwitchBack ? <SwitchBack /> : null}</> : null}</>
  );
};

export default ActionHandler;
