import { render, waitFor } from '@testing-library/react';
import { ACTIVITY } from 'apps/activity-history/constants';
import { ActivityRenderType } from 'apps/activity-history/types';
import OpportunityActivity from './OpportunityActivity';
import Body from './Body';
import Icon from './Icon';

// Arrange
const mockData = {
  Id: '1',
  ActivityType: 1,
  ActivityDateTime: '2021-01-01T00:00:00Z',
  ActivityRenderType: ActivityRenderType.Opportunity,
  ActivityEvent: ACTIVITY.OPPORTUNITY_CAPTURE,
  AdditionalDetails: {
    ActivityScore: '5',
    RelatedActivityId: '2',
    CreatedByName: 'John Doe',
    CreatedBy: '3'
  },
  LeadId: '4'
};

describe('OpportunityActivity component', () => {
  it('Should renders OpportunityActivity component', async () => {
    // Act
    const { getByText } = render(<OpportunityActivity data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Opportunity Capture')).toBeInTheDocument();
    });
  });
});

describe('Body component', () => {
  it('Should render the component with Opportunity Capture event', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Opportunity Capture')).toBeInTheDocument();
    });
  });

  it('Should render the component with Duplicate Detected event', async () => {
    // Arrange
    const duplicateData = { ...mockData, ActivityEvent: ACTIVITY.DUPLICATE_OPP_DETECTED };

    // Act
    const { getByText } = render(<Body data={duplicateData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Duplicate Detected')).toBeInTheDocument();
    });
  });

  it('Should not render Opportunity component when RelatedActivityId is not present', async () => {
    // Arrange
    const noRelatedActivityData = {
      ...mockData,
      AdditionalDetails: { ...mockData.AdditionalDetails, RelatedActivityId: '' }
    };

    // Act
    const { queryByText } = render(<Body data={noRelatedActivityData} />);

    // Assert
    await waitFor(() => {
      expect(queryByText('Opportunity')).not.toBeInTheDocument();
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

describe('Icon component', () => {
  it('Should render fullscreen icon when event is OPPORTUNITY_CAPTURE', async () => {
    // Act
    const { getByText } = render(<Icon activityEvent={ACTIVITY.OPPORTUNITY_CAPTURE} />);

    // Assert
    await waitFor(() => {
      expect(getByText('fullscreen')).toBeInTheDocument();
    });
  });

  it('Should render timeline icon when event is not OPPORTUNITY_CAPTURE', async () => {
    // Act
    const { getByText } = render(<Icon activityEvent={999} />);

    // Assert
    await waitFor(() => {
      expect(getByText('timeline')).toBeInTheDocument();
    });
  });
});
