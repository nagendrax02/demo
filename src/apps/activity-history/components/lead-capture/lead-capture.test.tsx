import { render, waitFor } from '@testing-library/react';
import LeadCapture from './LeadCapture';
import Body from './Body';
import { ActivityRenderType } from '../../types';

// Arrange
const mockData = {
  Id: '1',
  ActivityType: 10,
  ActivityEvent: 20,
  ActivityName: 'Test Activity',
  ActivityDateTime: '2021-01-01T00:00:00Z',
  ActivityRenderType: ActivityRenderType.LeadCapture,
  AdditionalDetails: {
    ActivityScore: '5',
    ActivityEvent_Note: '{"Key": "Value"}',
    CreatedByName: 'John Doe',
    CreatedBy: '2'
  }
};

describe('LeadCapture component', () => {
  it('Should render LeadCapture component', async () => {
    // Act
    const { getByText } = render(<LeadCapture data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Test Activity')).toBeInTheDocument();
    });
  });
});

describe('Body component', () => {
  it('Should render Body component', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Test Activity')).toBeInTheDocument();
    });
  });

  it('Should render ActivityTable and Accordion when activityEventNoteDetails length > 0', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Test Activity')).toBeInTheDocument();
    });
  });

  it('Should not render ActivityTable and Accordion when activityEventNoteDetails length < 0', async () => {
    mockData.AdditionalDetails.ActivityEvent_Note = '';
    // Act
    const { queryByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(queryByText('Test Activity')).not.toBeInTheDocument();
    });
  });

  it('Should render MetaDataInfo', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Added by')).toBeInTheDocument();
      expect(getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('Should render ActivityScore', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('+5')).toBeInTheDocument();
    });
  });
});
