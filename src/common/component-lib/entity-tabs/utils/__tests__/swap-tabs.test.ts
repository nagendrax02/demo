import { render, screen, waitFor } from '@testing-library/react';
import { mockTabConfig } from '../../__mock__/data';
import {
  swapActiveTabWithLastVisibleTab,
  swapLastVisibleTabWithSelectedOverflowingTab
} from '../swap-tabs';

describe('Swap active tab With last visibleTab', () => {
  test('Should swap last visible tab with active tab', () => {
    //Arrange
    const activeTabId = '8';
    const lastVisibleTabIdIndex = 5;
    const swappedTabConfig = swapActiveTabWithLastVisibleTab(mockTabConfig, activeTabId);

    //Assert
    expect(swappedTabConfig[lastVisibleTabIdIndex]?.id).toBe('5');
  });

  test('Should return empty array when tab config is null or empty', () => {
    //Arrange
    const overflownTabId = '6';
    const swappedTabConfig = swapActiveTabWithLastVisibleTab([], overflownTabId);

    //Assert
    expect(swappedTabConfig).toEqual([]);
  });
});

describe('Swap last visible tab with selected overflowing tab', () => {
  test('Should swap last visible tab with selected overflown tab', () => {
    //Arrange
    const selectedOverflownTab = {
      id: '6',
      name: 'Connector Tab 1',
      isOverflowing: true,
      width: 120
    };
    const lastVisibleTabIdIndex = 6;
    const swappedTabConfig = swapLastVisibleTabWithSelectedOverflowingTab(
      mockTabConfig,
      selectedOverflownTab
    );

    //Assert
    expect(swappedTabConfig[lastVisibleTabIdIndex]?.id).toBe(selectedOverflownTab?.id);
  });

  test('Should return empty array when tab config is null or empty', () => {
    //Arrange
    const swappedTabConfig = swapLastVisibleTabWithSelectedOverflowingTab([], undefined);

    //Assert
    expect(swappedTabConfig).toEqual([]);
  });
});
