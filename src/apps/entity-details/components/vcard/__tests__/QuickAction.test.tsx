import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import QuickAction from '../quick-action/QuickAction';
import * as quickActionUtils from '../quick-action/utils';
import { convertedQuickAction, quickAction } from '../__mocks__/data';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

const mockHoverEvent = (testId) => {
  fireEvent.mouseEnter(screen.getByTestId(testId));
};

describe('QuickAction', () => {
  it('Should render shimmer when lodaing state is true', () => {
    // Act
    const { getByTestId } = render(
      <QuickAction isLoading={true} config={undefined} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    expect(getByTestId('quick-action-shimmer')).toBeInTheDocument();
  });

  it('Should render quick actions', async () => {
    // Arrange
    const mockConfig = [
      { icon: 'star', name: 'action1', onClick: jest.fn() },
      { icon: 'share', name: 'action2', onClick: jest.fn() }
    ];

    // Act
    const { getByTestId } = render(
      <QuickAction isLoading={false} config={mockConfig} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(getByTestId('quick-action-action1')).toBeInTheDocument();
      expect(getByTestId('quick-action-action2')).toBeInTheDocument();
    });
  });

  it('Should handle click events when button is clicked', async () => {
    // Arrange
    const mockOnClick = jest.fn();
    const mockConfig = [{ icon: 'star', name: 'action1', onClick: mockOnClick }];

    // Act
    const { getByTestId } = render(
      <QuickAction isLoading={false} config={mockConfig} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    fireEvent.click(getByTestId('quick-action-action1'));
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalled();
    });
  });
});

describe('Process Quick Actions', () => {
  it('Should show process forms on hover of action if more than one form is present', async () => {
    // Arrange
    const actions = [quickAction];
    jest
      .spyOn(quickActionUtils, 'getConvertedQuickActions')
      .mockReturnValue([convertedQuickAction]);
    const { queryByTestId } = render(
      <QuickAction config={actions} isLoading={false} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Act
    mockHoverEvent(`quick-action-${quickAction.name}`);

    // Assert
    await waitFor(() =>
      expect(
        queryByTestId(`menu-item-${convertedQuickAction.subMenu[0].value}`)
      ).toBeInTheDocument()
    );
  });
});
