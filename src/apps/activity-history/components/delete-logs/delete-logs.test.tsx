import { render, screen, waitFor } from '@testing-library/react';
import DeleteLogs from './DeleteLogs';
import Body from './Body';
import Icon from './Icon';
import { ActivityRenderType } from '../../types';
import { ACTIVITY } from '../../constants';

const mockTimelineData = {
  ActivityName: 'Delete Opportunity',
  AdditionalDetails: {
    ActivityScore: '5',
    CreatedByName: 'John Doe',
    CreatedBy: '123',
    RelatedActivityName: 'RelatedActivityName'
  },
  ActivityEvent: ACTIVITY.DELETE_LOG,
  LeadId: '123',
  ActivityRenderType: ActivityRenderType.DeleteLogs
};

describe('DeleteLogs component', () => {
  it('Should render correctly with provided data', async () => {
    // Act
    render(<DeleteLogs data={mockTimelineData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('+5')).toBeInTheDocument();
      expect(screen.getByText('Delete Opportunity')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

describe('Body component', () => {
  it('Should display activity name and creator information', async () => {
    // Act
    render(<Body data={mockTimelineData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('+5')).toBeInTheDocument();
      expect(screen.getByText('Delete Opportunity')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

describe('Icon component', () => {
  it('Should render correct icon', () => {
    // Act
    render(<Icon data={mockTimelineData} />);

    // Assert
    expect(screen.getByText('list_alt')).toBeInTheDocument();
  });

  it('Should render with the bg_blue_500 class when activity-event is not opportunity-delete-log', () => {
    // Act
    render(<Icon data={mockTimelineData} />);

    // Assert
    expect(screen.getByTestId('icon-wrapper')).toHaveClass('bg_blue_500');
  });

  it('Should render with the bg_purple_500 class when activity-event is opportunity-delete-log', () => {
    // Act
    mockTimelineData.ActivityEvent = ACTIVITY.OPPORTUNITY_DELETE_LOG;
    render(<Icon data={mockTimelineData} />);

    // Assert
    expect(screen.getByTestId('icon-wrapper')).toHaveClass('bg_purple_500');
  });
});
