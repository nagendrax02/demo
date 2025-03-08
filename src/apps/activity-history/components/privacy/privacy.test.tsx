import { render, screen, waitFor } from '@testing-library/react';
import { ActivityRenderType } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import Privacy from './Privacy';

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
describe('Privacy component', () => {
  it('Should render Privacy component', async () => {
    // Act
    const { getByText } = render(<Privacy data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('FirstName LastName')).toBeInTheDocument();
      expect(getByText('+5')).toBeInTheDocument();
    });
  });

  it('Should render security icon', async () => {
    // Act
    render(<Privacy data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('security')).toBeInTheDocument();
    });
  });
});
