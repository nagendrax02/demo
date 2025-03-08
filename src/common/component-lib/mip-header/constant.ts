import { isFeatureEnabled } from 'apps/external-app/utils/utils';
import { ActionId, IMiPHeader } from './mip-header.types';
import { canHideSwitchBack } from './utils';

export const leftAction: IMiPHeader[] = [
  {
    title: 'Back',
    id: ActionId.Back,
    dataTestId: 'lsq-marvin-back',
    icon: 'arrow_back'
  }
];
export const rightActions: IMiPHeader[] = [
  {
    title: 'Give Feedback',
    id: ActionId.GiveFeedback,
    dataTestId: 'lsq-marvin-Share-Feedback',
    icon: 'rate_review',
    doNotAct: true,
    canHide: !isFeatureEnabled('enable-pendo')
  },
  {
    title: 'Switch Back',
    id: ActionId.SwitchBack,
    canHide: canHideSwitchBack() === '1',
    dataTestId: 'lsq-marvin-switch-back',
    icon: 'keyboard_double_arrow_left'
  }
];
