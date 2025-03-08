import { render, screen, waitFor } from '@testing-library/react';
import { ActivityRenderType } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import Body from './Body';
import FormSubmittedOnWebsite from './FormSubmittedOnWebsite';
import PageVisitedOnWebsite from './PageVisitedOnWebsite';

describe('Body', () => {
  const mockData = {
    AdditionalDetails: {
      ActivityScore: '1',
      WebPublishedURL: 'https://example.com',
      WebContentName: 'Example',
      ActivityEvent_Note: 'Note',
      IsLandingPage: '1'
    },
    ActivityName: 'Activity',
    ActivityEvent: ACTIVITY.PAGE_VISITED_ON_WEBSITE,
    ActivityRenderType: ActivityRenderType.Web
  };

  it('Should render Body component', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText(/Viewed landing page/i)).toBeInTheDocument();
    });
  });

  it('Should render FormSubmittedOnWebsite when ActivityEvent is FORM_SUBMITTED_ON_WEBSITE', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.FORM_SUBMITTED_ON_WEBSITE;

    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Example')).toBeInTheDocument();
    });
  });

  it('Should render PageVisitedOnWebsite when ActivityEvent is PAGE_VISITED_ON_WEBSITE', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.PAGE_VISITED_ON_WEBSITE;

    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText(/Viewed landing page/i)).toBeInTheDocument();
    });
  });

  it('Should render tracking URL when ActivityEvent is TRACKING_URL_CLICKED', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.TRACKING_URL_CLICKED;

    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Clicked on tracking url for')).toBeInTheDocument();
    });
  });
});

describe('FormSubmittedOnWebsite', () => {
  const additionalDetails = {
    FormData: '[{Feild: "field", Value: "value"}]',
    WebPublishedURL: 'url',
    WebContentName: 'Name',
    TrafficSource: 'Source'
  };

  it('Should renders FormSubmittedOnWebsite component', () => {
    // Act
    render(<FormSubmittedOnWebsite additionalDetails={additionalDetails} />);

    // Assert
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('Should not render anchor tag when WebPublishedURL is empty', () => {
    // Arrange
    additionalDetails.WebPublishedURL = '';

    // Act
    render(<FormSubmittedOnWebsite additionalDetails={additionalDetails} />);

    // Assert
    const anchor = screen.queryByRole('a');
    expect(anchor).not.toBeInTheDocument();
  });

  it('Should not render the Table component when tableRows is empty', () => {
    // Arrange
    additionalDetails.FormData = '';

    // Act
    render(<FormSubmittedOnWebsite additionalDetails={additionalDetails} />);

    // Assert
    const table = screen.queryByRole('table');
    expect(table).not.toBeInTheDocument();
  });
});

describe('PageVisitedOnWebsite', () => {
  const data = {
    ActivityRenderType: ActivityRenderType.Web,
    AdditionalDetails: {
      IsLandingPage: '1',
      ActivityEventCount: '4',
      TimeSpent: '30',
      TrafficSource: 'Source'
    }
  };

  it('Should renders PageVisitedOnWebsite component', () => {
    // Act
    render(<PageVisitedOnWebsite data={data} />);

    // Assert
    expect(screen.getByText(/Viewed landing page/i)).toBeInTheDocument();
  });
});
