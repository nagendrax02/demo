import { render, screen, waitFor } from '@testing-library/react';
import Body from 'src/apps/activity-history/components/opportunity-audit/Body';
import { ACTIVITY } from 'src/apps/activity-history/constants';
import { ActivityRenderType } from '../../types';

describe('OpportunityAudit Body', () => {
  const mockData = {
    ActivityEvent: null,
    ActivityName: '',
    AuditData: {
      OldValue: '',
      NewValue: '',
      ChangedBy: ''
    },
    ActivityRenderType: ActivityRenderType.OpportunityAudit,
    AdditionalDetails: {
      ActivityScore: '',
      FieldDisplayName: '',
      OldAdditionalValue: '',
      NewAdditionalValue: '',
      CreatedBy: ''
    }
  };

  it('Should render Assigned component for OPPORTUNITY_ASSIGNED event', async () => {
    // Arrange
    const testData = { ...mockData, ActivityEvent: ACTIVITY.OPPORTUNITY_ASSIGNED };

    // Act
    render(<Body data={testData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('assigned')).toBeInTheDocument();
    });
  });

  it('Should render StatusChange component for OPPORTUNITY_STATUS_CHANGE event', async () => {
    // Arrange
    const testData = { ...mockData, ActivityEvent: ACTIVITY.OPPORTUNITY_STATUS_CHANGE };

    // Act
    render(<Body data={testData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('status-change')).toBeInTheDocument();
    });
  });

  it('Should render StatusChange component for OPPORTUNITY_STATUS_CHANGE1 event', async () => {
    // Arrange
    const testData = { ...mockData, ActivityEvent: ACTIVITY.OPPORTUNITY_STATUS_CHANGE1 };

    // Act
    render(<Body data={testData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('status-change')).toBeInTheDocument();
    });
  });

  it('Should render SourceChange component for OPPORTUNITY_SOURCE_CHANGE event', async () => {
    // Arrange
    const testData = { ...mockData, ActivityEvent: ACTIVITY.OPPORTUNITY_SOURCE_CHANGE };

    // Act
    render(<Body data={testData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('source-change')).toBeInTheDocument();
    });
  });

  it('Should render ActivityScore component with correct score', async () => {
    // Arrange
    const testData = {
      ...mockData,
      ActivityEvent: 0,
      AdditionalDetails: { ...mockData.AdditionalDetails, ActivityScore: '85' }
    };

    // Act
    render(<Body data={testData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('+85')).toBeInTheDocument();
    });
  });
});
