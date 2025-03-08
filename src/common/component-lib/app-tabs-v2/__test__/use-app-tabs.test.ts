import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';
import useAppTabs from '../use-app-tabs';
import { getMoreTabsList, setAppTabsConfig } from '../app-tabs.store';
import { getCachedTabConfig } from '../utils/cache-utils';
import { createNewAppTabConfig, getActiveAppTabId, isValidPath } from '../utils/hook-utils';
import { ITabConfig, TabIconType } from '../app-tabs.types';

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

  it('Should add new tab to 1st position', () => {
    // Arrange
    const mockCacheAppTabConfig: ITabConfig[] = [
      {
        id: '/other-path',
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
        isActiveTab: true,
        title: 'lead-1',
        url: '/leaddetails?leadid=123',
        iconType: TabIconType.Lead
      },
      {
        id: '/other-path',
        isActiveTab: false,
        title: 'other-tab',
        url: '/other-path',
        iconType: TabIconType.Lead
      }
    ]);
  });
});
