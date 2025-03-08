import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';
import useAppTabs from '../use-app-tabs';
import { getMoreTabsList, setAppTabsConfig } from '../app-tabs.store';
import { getCachedTabConfig } from '../utils/cache-utils';
import { createNewAppTabConfig, getActiveAppTabId, isValidPath } from '../utils/hook-utils';
import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';

jest.mock('wouter', () => ({
  useLocation: jest.fn()
}));

jest.mock('wouter/use-location', () => ({
  useSearch: jest.fn()
}));

jest.mock('../app-tabs.store', () => ({
  __esModule: true,
  default: jest.fn(),
  setAppTabsConfig: jest.fn(),
  getMoreTabsList: jest.fn()
}));

jest.mock('../utils/cache-utils', () => ({
  getCachedTabConfig: jest.fn()
}));

jest.mock('../utils/hook-utils', () => ({
  createNewAppTabConfig: jest.fn(),
  isValidPath: jest.fn(),
  getActiveAppTabId: jest.fn(),
  getMaxTabLimit: jest.fn()
}));

describe('useAppTabs hook', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/test-path', search: '?testid=123' }
    });
    (useLocation as jest.Mock).mockReturnValue(['/test-path']);
    (useSearch as jest.Mock).mockReturnValue(['?query=test']);
    (getCachedTabConfig as jest.Mock).mockReturnValue([]);
    (getMoreTabsList as jest.Mock).mockReturnValue([]);
    (createNewAppTabConfig as jest.Mock).mockReturnValue({
      id: '/test-path?testid=123',
      type: 'Primary',
      isActiveTab: true
    });
    (isValidPath as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should initialize app tabs correctly', async () => {
    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(getCachedTabConfig).toHaveBeenCalled();
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      { id: '/test-path?testid=123', type: 'Primary', isActiveTab: true }
    ]);
  });

  it('Should update active tab if it exists', async () => {
    // Arrange
    (getCachedTabConfig as jest.Mock).mockReturnValue([
      { id: '/test-path?testid=123', type: 'Primary', isActiveTab: false }
    ]);

    (getActiveAppTabId as jest.Mock).mockReturnValue('/test-path?testid=123');

    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      { id: '/test-path?testid=123', type: 'Primary', isActiveTab: true }
    ]);
  });

  it('Should add new tab if path is valid and tab does not exist', async () => {
    // Arrange
    (getCachedTabConfig as jest.Mock).mockReturnValue([
      { id: '/other-path', type: 'Secondary', isActiveTab: false }
    ]);
    (createNewAppTabConfig as jest.Mock).mockReturnValue({
      id: '/test-path?testid=123',
      type: 'Primary',
      isActiveTab: true
    });

    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      { id: '/test-path?testid=123', type: 'Primary', isActiveTab: true },
      { id: '/other-path', type: 'Secondary', isActiveTab: false }
    ]);
  });
  it('Should replace existing primary tab if new primary tab is opened', () => {
    // Arrange
    const mockCacheAppTabConfig: ITabConfig[] = [
      {
        id: '/test-path-1?testid=123',
        type: TabType.Primary,
        isActiveTab: true,
        title: 'test-tab-1',
        url: '/test-path-1?testid=123',
        iconType: TabIconType.Custom
      },
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ];

    (getCachedTabConfig as jest.Mock).mockReturnValue(mockCacheAppTabConfig);
    (getActiveAppTabId as jest.Mock).mockReturnValue('/test-path-2?testid=123');
    (createNewAppTabConfig as jest.Mock).mockReturnValue({
      id: '/test-path-2?testid=123',
      type: TabType.Primary,
      isActiveTab: true,
      title: 'test-tab-2',
      url: '/test-path-2?testid=123',
      iconType: TabIconType.Custom
    });

    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      {
        id: '/test-path-2?testid=123',
        type: TabType.Primary,
        isActiveTab: true,
        title: 'test-tab-2',
        url: '/test-path-2?testid=123',
        iconType: TabIconType.Custom
      },
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ]);
  });

  it('Should add new primary tab to first position if there is no existing primary tab', () => {
    // Arrange
    const mockCacheAppTabConfig: ITabConfig[] = [
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: true,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ];

    (getCachedTabConfig as jest.Mock).mockReturnValue(mockCacheAppTabConfig);
    (getActiveAppTabId as jest.Mock).mockReturnValue('/test-path-2?testid=123');

    (createNewAppTabConfig as jest.Mock).mockReturnValue({
      id: '/test-path-2?testid=123',
      type: TabType.Primary,
      isActiveTab: true,
      title: 'test-tab-2',
      url: '/test-path-2?testid=123',
      iconType: TabIconType.Custom
    });

    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      {
        id: '/test-path-2?testid=123',
        type: TabType.Primary,
        isActiveTab: true,
        title: 'test-tab-2',
        url: '/test-path-2?testid=123',
        iconType: TabIconType.Custom
      },
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ]);
  });

  it('Should add new secondary to 2nd position if there is a primary tab present', () => {
    // Arrange
    const mockCacheAppTabConfig: ITabConfig[] = [
      {
        id: '/test-path-1?testid=123',
        type: TabType.Primary,
        isActiveTab: true,
        title: 'test-tab-1',
        url: '/test-path-1?testid=123',
        iconType: TabIconType.Custom
      },
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ];

    (getCachedTabConfig as jest.Mock).mockReturnValue(mockCacheAppTabConfig);
    (getActiveAppTabId as jest.Mock).mockReturnValue('/leaddetails?leadid=123');

    (createNewAppTabConfig as jest.Mock).mockReturnValue({
      id: '/leaddetails?leadid=123',
      type: TabType.Secondary,
      isActiveTab: true,
      title: 'lead-1',
      url: '/leaddetails?leadid=123',
      iconType: TabIconType.Lead
    });

    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      {
        id: '/test-path-1?testid=123',
        type: TabType.Primary,
        isActiveTab: false,
        title: 'test-tab-1',
        url: '/test-path-1?testid=123',
        iconType: TabIconType.Custom
      },
      {
        id: '/leaddetails?leadid=123',
        type: TabType.Secondary,
        isActiveTab: true,
        title: 'lead-1',
        url: '/leaddetails?leadid=123',
        iconType: TabIconType.Lead
      },
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ]);
  });

  it('Should add new secondary to 1st position if there is no primary tab present', () => {
    // Arrange
    const mockCacheAppTabConfig: ITabConfig[] = [
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ];

    (getCachedTabConfig as jest.Mock).mockReturnValue(mockCacheAppTabConfig);
    (getActiveAppTabId as jest.Mock).mockReturnValue('/leaddetails?leadid=123');

    (createNewAppTabConfig as jest.Mock).mockReturnValue({
      id: '/leaddetails?leadid=123',
      type: TabType.Secondary,
      isActiveTab: true,
      title: 'lead-1',
      url: '/leaddetails?leadid=123',
      iconType: TabIconType.Lead
    });

    // Act
    renderHook(() => useAppTabs());

    // Assert
    expect(setAppTabsConfig).toHaveBeenCalledWith([
      {
        id: '/leaddetails?leadid=123',
        type: TabType.Secondary,
        isActiveTab: true,
        title: 'lead-1',
        url: '/leaddetails?leadid=123',
        iconType: TabIconType.Lead
      },
      {
        id: '/other-path',
        type: TabType.Secondary,
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ]);
  });
});
