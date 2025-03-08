import { render, screen, waitFor } from '@testing-library/react';
import Body from './body';
import Portal from './Portal';
import Icon from './Icon';
import { ActivityRenderType } from '../../types';
import { ACTIVITY } from '../../constants';

// Arrange
const mockData = {
  ActivityDateTime: '2023-01-01T12:00:00Z',
  ActivityEvent: ACTIVITY.LOGGED_INTO_PORTAL,
  ActivityRenderType: ActivityRenderType.Portal,
  AdditionalDetails: {
    ActivityScore: '5',
    PortalDisplayName: 'Example Portal',
    PortalUrl: 'https://example.com',
    CreatedByName: 'John Doe',
    CreatedBy: 'user123'
  }
};

describe('Icon Component', () => {
  it('Should render correct icon', async () => {
    // Act
    const { getByText } = render(<Icon />);

    // Assert
    await waitFor(() => {
      expect(getByText('web')).toBeInTheDocument();
    });
  });
});

describe('Portal Component', () => {
  it('Should render correctly with provided data', async () => {
    render(<Portal data={mockData} />);

    await waitFor(
      () => {
        expect(screen.getByText('+5')).toBeInTheDocument();
        expect(screen.getByText('Logged into')).toBeInTheDocument();
        expect(screen.getByText('Example Portal')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { interval: 500 }
    );
  });
});

describe('Body Component', () => {
  it('Should render "Portal" text if PortalDisplayName is not provided', () => {
    const dataWithoutPortalName = {
      ...mockData,
      ActivityEvent: ACTIVITY.LOGGED_OUT_PORTAL,
      AdditionalDetails: {
        PortalDisplayName: ''
      }
    };

    render(<Body data={dataWithoutPortalName} />);

    expect(screen.getByText('Portal')).toBeInTheDocument();
  });

  it('Should render a link if PortalUrl is provided', () => {
    const { container } = render(
      <Body data={{ ...mockData, ActivityEvent: ACTIVITY.FORGOT_PASSWORD }} />
    );
    const link = container.querySelector('a');

    expect(link).toBeInTheDocument();
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
  });

  it('Should display date and time if ActivityDateTime is provided', () => {
    render(<Body data={{ ...mockData, ActivityEvent: 34 }} />);

    expect(screen.getByText('on')).toBeInTheDocument();
  });
});
