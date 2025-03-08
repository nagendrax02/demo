import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ActivityRenderType } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import Body from './Body';

describe('Body', () => {
  const mockData = {
    AdditionalDetails: {
      ActivityScore: '5',
      ActivityUserFirstName: 'FirstName',
      ActivityUserLastName: 'LastName',
      MXCustom2: '1',
      CreatedBy: '211'
    },
    ActivityDateTime: '2021-08-10T10:00:00.000Z',
    ActivityName: 'Activity',
    ActivityEvent: ACTIVITY.DO_NOT_TRACK_REQUEST,
    ActivityRenderType: ActivityRenderType.Privacy
  };

  it('Should render Body component', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('FirstName LastName')).toBeInTheDocument();
      expect(getByText(/Do Not Track Request: Tracking Disabled/i)).toBeInTheDocument();
      expect(getByText('+5')).toBeInTheDocument();
    });
  });

  it('Should render Tracking Disabled when ActivityEvent is DO_NOT_TRACK_REQUEST and MXCustom2 is equal to 1', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText(/Tracking Disabled/i)).toBeInTheDocument();
    });
  });

  it('Should render Tracking Enabled when ActivityEvent is DO_NOT_TRACK_REQUEST and MXCustom2 is not equal to 1', async () => {
    // Arrange
    mockData.AdditionalDetails.MXCustom2 = '2';
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText(/Tracking Enabled/i)).toBeInTheDocument();
    });
  });

  it('Should not render Do Not Track Request when ActivityEvent is not DO_NOT_TRACK_REQUEST', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.OPTED_IN_FOR_EMAIL;

    // Act
    const { queryByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(queryByText(/Do Not Track Request/i)).not.toBeInTheDocument();
    });
  });

  it('Should render accordion name as Opted-in for Email when ActivityEvent is not OPTED_IN_FOR_EMAIL', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.OPTED_IN_FOR_EMAIL;

    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Opted-in for Email')).toBeInTheDocument();
    });
  });

  it('Should render accordion name as Opted-out for Email when ActivityEvent is OPTED_OUT_FOR_EMAIL', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.OPTED_OUT_FOR_EMAIL;

    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Opted-out for Email')).toBeInTheDocument();
    });
  });

  it('Should not render accordion name as Opted-out for Email/Opted-in for Email/View Details when ActivityEvent is invalid', async () => {
    // Arrange
    mockData.ActivityEvent = -1;

    // Act
    const { queryByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(queryByText('Opted-out for Email')).not.toBeInTheDocument();
      expect(queryByText('Opted-in for Email')).not.toBeInTheDocument();
      expect(queryByText('View details')).not.toBeInTheDocument();
    });
  });
});
