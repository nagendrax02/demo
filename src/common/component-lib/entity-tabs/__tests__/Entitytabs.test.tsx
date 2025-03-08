import { render, screen, waitFor } from '@testing-library/react';
import EntityTabs from '../EntityTabs';
import * as store from '../store';

import { mockTabConfig } from '../__mock__/data';
import { tabMock } from './tab-mock';
import { ITabConfiguration } from 'common/types/entity/lead';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from '../../../constants';

const initialState = {
  setAugmentedTabs: jest.fn(),
  activeTabKey: '1',
  augmentedTabs: mockTabConfig,
  setActiveTabKey: jest.fn(),
  reset: jest.fn()
};

describe('Name', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should render entity tabs', async () => {
    //Arrange
    jest.spyOn(store, 'default').mockReturnValueOnce({
      ...initialState
    });

    await waitFor(() => {
      render(
        <EntityTabs
          config={tabMock as unknown as ITabConfiguration[]}
          isLoading={false}
          coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
        />
      );
    });

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('entity-tabs')).toBeInTheDocument();
    });
  });

  test('Should set overflowing tab as an active tab when it is clicked', async () => {
    //Arrange
    window.innerWidth = 500;
    jest.spyOn(store, 'default').mockReturnValueOnce({
      ...initialState,
      activeTabKey: '7'
    });

    // Act
    await waitFor(() => {
      render(
        <EntityTabs
          config={tabMock as unknown as ITabConfiguration[]}
          isLoading={false}
          coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
        />
      );
    });

    //Assert
    await waitFor(() => {
      expect(screen.getAllByTestId('tab-content')?.[1]).toBeInTheDocument();
    });
  });
});
