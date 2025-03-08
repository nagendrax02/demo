import { render, screen, fireEvent } from '@testing-library/react';
import Tab from '../components/tab';
import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';
import useAppTabsStore from '../app-tabs.store';
import { getCloseTabButton, getTabIconElement, onTabSelect } from '../components/tab/utils';

jest.mock('../app-tabs.store');
jest.mock('../components/tab/utils');

jest.mock('../app-tabs.store', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('Tab Component', () => {
  const mockConfig: ITabConfig = {
    id: '1',
    title: 'Tab 1',
    type: TabType.Primary,
    url: 'http://example.com',
    isActiveTab: true,
    iconType: TabIconType.Lead
  };

  const mockAppTabsConfig = {
    tabs: [mockConfig]
  };

  beforeEach(() => {
    (useAppTabsStore as unknown as jest.Mock).mockReturnValue({ appTabsConfig: mockAppTabsConfig });
    (getTabIconElement as jest.Mock).mockReturnValue(<span>Icon</span>);
    (getCloseTabButton as jest.Mock).mockReturnValue(<button>Close</button>);
  });

  it('Should render the tab with title and icon', async () => {
    // Act
    render(<Tab config={mockConfig} />);

    // Assert
    const tabElement = await screen.findByTestId('app-tab');
    expect(tabElement).toBeInTheDocument();
    expect(tabElement).toHaveTextContent('Tab 1');
    expect(tabElement).toHaveTextContent('Icon');
  });

  it('Should call onTabSelect when the tab is clicked', () => {
    // Act
    render(<Tab config={mockConfig} />);

    // Assert
    const tabElement = screen.getByTestId('app-tab');
    fireEvent.click(tabElement);
    expect(onTabSelect).toHaveBeenCalled();
  });

  it('Should render the close button', () => {
    // Act
    render(<Tab config={mockConfig} />);

    // Assert
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});
