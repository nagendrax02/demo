import React from 'react';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { DEFAULT_TAB_WIDTH } from './constants';
import { IPanel } from 'apps/smart-views/smartviews.types';

export const getVisibleTabsLength = (scrollRef: React.RefObject<HTMLDivElement>): number => {
  const width = scrollRef.current?.getBoundingClientRect()?.width || 0;
  return Math.floor(width / DEFAULT_TAB_WIDTH);
};

export const getScrollLeft = (scrollRef: React.RefObject<HTMLDivElement>): number => {
  const left = parseInt(scrollRef.current?.style.left?.replace('px', '') || '');
  return left;
};

export const disableLeft = (
  scrollRef: React.RefObject<HTMLDivElement>,
  offset: number
): boolean => {
  const left = getScrollLeft(scrollRef);
  if (left + offset === 0) {
    return true;
  }
  return false;
};

export const disableRight = (
  scrollRef: React.RefObject<HTMLDivElement>,
  hiddenTabsLength: number,
  offset: number
): boolean => {
  const left = getScrollLeft(scrollRef);
  if (hiddenTabsLength < 0) {
    return true;
  }
  if (left + offset === -(hiddenTabsLength * DEFAULT_TAB_WIDTH)) {
    return true;
  }
  return false;
};

export const getConvertedPanelActions = (panel: IPanel | null): IActionWrapperItem => {
  let subMenu: IMenuItem[] = [];
  if (panel) {
    const settings = panel.panelSettings?.options;
    subMenu = settings;
  }

  return {
    id: 'left_panel_settings',
    subMenu: subMenu
  };
};

export const ToggleInfoToolTipCustomStyles: React.CSSProperties = {
  display: 'flex',
  width: '352px',
  padding: 'var(--ng-gp-16)',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'absolute',
  top: '95px',
  left: '24px',
  boxSizing: 'border-box',
  borderRadius: 'var(--ng-rd-12)',
  background: 'rgb(var(--ng-neutral-white))',
  boxShadow: '0px 0px 2px 0px rgba(3, 3, 3, 0.12), 0px 0px 32px 0px rgba(3, 3, 3, 0.08)'
};

export const ExpandTooltipStyles: React.CSSProperties = {
  padding: '0px'
};
