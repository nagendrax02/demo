import { render, screen, waitFor } from '@testing-library/react';
import { EntityType } from 'src/common/types';
import { ActivityRenderType } from '../types';
import ActivityHistory from '../index';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

// Mock the useActivityHistory hook
jest.mock('../use-activity-history', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isLoading: false, augmentedActivityHistoryDetails: [] }))
}));

jest.mock('common/utils/rest-client', () => ({
  __esModule: true,
  httpGet: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

describe('ActivityHistory app', () => {
  // Arrange
  let mockData = [
    {
      ActivityEvent: '3001',
      ActivityRenderType: ActivityRenderType.LeadAudit,
      ActivityDateTime: '2023-12-06T12:30:00Z',
      ActivityName: 'ActivityName',
      AdditionalDetails: '',
      CanDeleteActivity: false,
      Id: '1',
      IsEditable: 0,
      LeadId: '',
      SystemDate: ''
    }
  ];

  it('Should render loading state', async () => {
    // Arrange
    jest.spyOn(require('../use-activity-history'), 'default').mockReturnValue({
      isLoading: true,
      augmentedActivityHistoryDetails: []
    });

    // Act
    render(
      <ActivityHistory
        type={EntityType.Lead}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    await waitFor(
      () => {
        expect(screen.getByTestId('timeline-group-shimmer')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // TODO: when component done for lead and opp audit
  // it('Should render LeadAudit content', async () => {
  //   // Arrange

  //   jest.spyOn(require('../use-activity-history'), 'default').mockReturnValue({
  //     isLoading: false,
  //     augmentedActivityHistoryDetails: mockData
  //   });

  //   // Act
  //   render(<ActivityHistory type={EntityType.Lead} />);

  //   await new Promise((r) => setTimeout(r, 1000));

  //   // Assert
  //   await waitFor(() => {
  //     expect(screen.getByText('Default ActivityName:3001')).toBeInTheDocument();
  //   });
  // });

  // it('Should render OpportunityAudit content', async () => {
  //   // Arrange
  //   mockData = [
  //     {
  //       ...mockData[0],
  //       ActivityEvent: '20000',
  //       ActivityRenderType: ActivityRenderType.OpportunityAudit,
  //       Id: '2'
  //     }
  //   ];

  //   jest.spyOn(require('../use-activity-history'), 'default').mockReturnValue({
  //     isLoading: false,
  //     augmentedActivityHistoryDetails: mockData
  //   });

  //   // Act
  //   render(<ActivityHistory type={EntityType.Lead} />);

  //   await new Promise((r) => setTimeout(r, 1000));

  //   // Assert
  //   await waitFor(() => {
  //     expect(screen.getByText('Default ActivityName:20000')).toBeInTheDocument();
  //   });
  // });
});
