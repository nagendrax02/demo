import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { getCachedTabConfig, IAppTabsCache, setTabConfigInCache } from '../utils/cache-utils';
import { ITabConfig, TabIconType } from '../app-tabs.types';

jest.mock('common/utils/experience', () => ({
  trackError: jest.fn()
}));

jest.mock('common/utils/storage-manager', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  StorageKey: {
    AppTabsConfig: 'AppTabsConfig'
  }
}));

describe('Cache Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCachedTabConfig', () => {
    it('Should return cached tab config if available', () => {
      // Arrange
      const mockConfig: IAppTabsCache = {
        appTabsConfig: [
          {
            id: '1',
            title: 'Tab 1',
            url: 'http://example.com',
            isActiveTab: true,
            iconType: TabIconType.Lead
          }
        ],
        moreTabsList: []
      };

      (getItem as jest.Mock).mockReturnValue(mockConfig);

      // Act
      const result = getCachedTabConfig();

      // Assert
      expect(result).toEqual(mockConfig?.appTabsConfig);
      expect(getItem).toHaveBeenCalledWith(StorageKey.AppTabsConfig);
    });

    it('Should return null if no cached tab config is available', () => {
      // Arrange
      (getItem as jest.Mock).mockReturnValue(null);

      // Act
      const result = getCachedTabConfig();

      // Assert
      expect(result).toBeNull();
      expect(getItem).toHaveBeenCalledWith(StorageKey.AppTabsConfig);
    });
  });

  describe('setTabConfigInCache', () => {
    it('Should set tab config in cache', () => {
      // Arrange
      (getItem as jest.Mock).mockReturnValue({ appTabsConfig: [], moreTabsList: [] });
      const mockConfig: ITabConfig[] = [
        {
          id: '1',
          title: 'Tab 1',
          url: 'http://example.com',
          isActiveTab: true,
          iconType: TabIconType.Lead
        }
      ];

      // Act
      setTabConfigInCache(mockConfig);

      // Assert
      expect(setItem).toHaveBeenCalledWith(StorageKey.AppTabsConfig, {
        appTabsConfig: mockConfig,
        moreTabsList: []
      });
    });
  });
});
