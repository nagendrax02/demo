import { render, screen } from '@testing-library/react';
import DateTime from './DateTime';
import { ActivityRenderType } from 'src/apps/activity-history/types';

describe('DateTime component', () => {
  //  Arrange
  const data = {
    ActivityDateTime: '2023-12-06T12:30:00Z',
    ActivityRenderType: ActivityRenderType.Custom,
    ActivityEvent: 0,
    ActivityName: '',
    ActivityType: 0,
    AdditionalDetails: {},
    CanDeleteActivity: false,
    Id: '',
    IsEditable: 0,
    LeadId: '',
    SystemDate: ''
  };

  it('Should render date and time correctly', () => {
    // Act
    render(<DateTime data={data} />);

    // Assert
    expect(screen.getByText('06')).toBeInTheDocument();
    expect(screen.getByText('Dec')).toBeInTheDocument();
  });

  it('Should render nothing when date or time is not available', () => {
    //  Arrange
    data.ActivityDateTime = '';
    // Act
    render(<DateTime data={data} />);

    // Assert
    expect(screen.queryByTestId('date-time-wrapper')).not.toBeInTheDocument();
  });
});
