import { render, screen, act } from '@testing-library/react';
import useAppTabs from '../use-app-tabs';
import useAppTabsStore from '../app-tabs.store';
import AppTabs from '../AppTabs';
import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';

jest.mock('../use-app-tabs', () => jest.fn());
jest.mock('../app-tabs.store', () => ({
  __esModule: true,
  default: jest.fn(),
  setMoreTabsList: jest.fn()
}));

const mockAppTabsConfig: ITabConfig[] = [
  {
    id: 'tab1',
    type: TabType.Primary,
    isActiveTab: true,
    title: 'testTab1',
    url: '/testTab1',
    iconType: TabIconType.Custom
  },
  {
    id: 'tab2',
    type: TabType.Secondary,
    isActiveTab: false,
    title: 'testTab2',
    url: '/testTab2',
    iconType: TabIconType.Custom
  },
  {
    id: 'tab3',
    type: TabType.Secondary,
    isActiveTab: false,
    title: 'testTab3',
    url: '/testTab3',
    iconType: TabIconType.Custom
  }
];

describe('AppTabs', () => {
  beforeEach(() => {
    (useAppTabs as jest.Mock).mockImplementation(() => {});
    (useAppTabsStore as unknown as jest.Mock).mockReturnValue({ appTabsConfig: mockAppTabsConfig });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render VisibleTabs component when there are visible tabs', () => {
    // Arrange
    render(<AppTabs />);

    const container = screen.getByTestId('app-tabs-container');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ width: 300 })
    });

    // Act
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Assert
    expect(screen.getByTestId('visible-tabs-wrapper')).toBeInTheDocument();
  });

  it('Should not render VisibleTabs component when there are no visible tabs', () => {
    (useAppTabsStore as unknown as jest.Mock).mockReturnValue({ appTabsConfig: [] });

    // Act
    render(<AppTabs />);

    // Assert
    expect(screen.queryByTestId('visible-tabs-wrapper')).not.toBeInTheDocument();
  });
});
