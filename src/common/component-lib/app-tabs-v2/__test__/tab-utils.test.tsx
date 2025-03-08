import {
  getBaseUrlFromBrowser,
  onTabClose,
  getTabIconElement,
  getCloseTabButton,
  onTabSelect,
  getTabStyleClass
} from '../components/tab/utils';
import { removeTab, setAppTabsConfig } from '../app-tabs.store';
import { ITabConfig, TabIconType } from '../app-tabs.types';
import { getTabIcon } from '../utils/render-utils';

import styles from '../components/tab/tab.module.css';

jest.mock('../app-tabs.store', () => ({
  removeTab: jest.fn(),
  setAppTabsConfig: jest.fn()
}));

jest.mock('../utils/render-utils', () => ({
  getTabIcon: jest.fn()
}));

const mockUpdateUrl = jest.fn();

describe('Tab Utils', () => {
  const mockConfig: ITabConfig = {
    id: '1',
    title: 'Tab 1',
    url: 'http://example.com',
    isActiveTab: true,
    iconType: TabIconType.Lead
  };

  describe('getBaseUrlFromBrowser', () => {
    it('Should return the base URL from the browser', () => {
      // Arrange
      const origin = 'http//localhost';
      Object.defineProperty(window, 'location', {
        value: {
          origin
        },
        writable: true
      });

      // Act & Assert
      expect(getBaseUrlFromBrowser()).toBe(origin);
    });
  });

  describe('onTabClose', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should remove the active tab and navigate to the next tab URL', () => {
      // Arrange
      const config = { ...mockConfig, id: '1', isActiveTab: true };
      const appTabsConfig = [
        { ...mockConfig, id: '1', url: 'http://localhost/tab1' },
        { ...mockConfig, id: '2', url: 'http://localhost/tab2' }
      ];

      Object.defineProperty(window, 'history', {
        value: {
          pushState: jest.fn()
        },
        writable: true
      });

      // Act
      onTabClose(config, appTabsConfig, mockUpdateUrl);

      // Assert
      expect(removeTab).toHaveBeenCalledWith('1');
      expect(mockUpdateUrl).toHaveBeenCalledWith('http://localhost/tab2');
    });

    it('Should remove the inactive tab without navigation', () => {
      // Arrange
      const config = { ...mockConfig, id: '1', isActiveTab: false };
      const appTabsConfig = [
        { ...mockConfig, id: '1', url: 'http://localhost/tab1' },
        { ...mockConfig, id: '2', url: 'http://localhost/tab2' }
      ];

      // Act
      onTabClose(config, appTabsConfig, mockUpdateUrl);

      // Assert
      expect(removeTab).toHaveBeenCalledWith('1');
      expect(window.history.pushState).not.toHaveBeenCalled();
    });
  });

  describe('getTabIconElement', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear all mocks before each test
    });
    it('Should return the tab icon element', () => {
      // Arrange
      const config = { ...mockConfig };
      (getTabIcon as jest.Mock).mockReturnValue(<div>Icon</div>);

      // Act
      const result = getTabIconElement(config);

      // Assert
      expect(result).toEqual(
        <div className={styles.tab_icon}>
          <div>Icon</div>
        </div>
      );
      expect(getTabIcon).toHaveBeenCalledWith(config);
    });
  });

  describe('getCloseTabButton', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear all mocks before each test
    });
    it('Should return the close tab buttons', () => {
      // Arrange
      const appTabsConfig = [];

      // Act
      const result = getCloseTabButton(mockConfig, appTabsConfig, mockUpdateUrl);

      // Assert
      expect(result).not.toBeNull();
    });
  });

  describe('onTabSelect', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear all mocks before each test
    });
    it('Should update the tab configuration and navigate to the tab URL', () => {
      // Arrange
      const config = { ...mockConfig, id: '1', url: 'http://localhost/tab1', isActiveTab: false };
      const appTabsConfig = [{ ...mockConfig, id: '1' }];
      const isMoreTab = true;

      Object.defineProperty(window, 'history', {
        value: {
          pushState: jest.fn()
        },
        writable: true
      });

      // Act
      onTabSelect({ config, appTabsConfig, updateUrl: mockUpdateUrl, isMoreTab });

      // Assert
      expect(setAppTabsConfig).toHaveBeenCalled();
      expect(mockUpdateUrl).toHaveBeenCalledWith('http://localhost/tab1');
    });

    it('Should not update the tab configuration for active tabs', () => {
      // Arrange
      const config = { ...mockConfig, id: '1', isActiveTab: true };
      const appTabsConfig = [{ ...mockConfig, id: '1' }];
      const isMoreTab = true;

      // Act
      onTabSelect({ config, appTabsConfig, updateUrl: mockUpdateUrl, isMoreTab });

      // Assert
      expect(setAppTabsConfig).not.toHaveBeenCalled();
      expect(mockUpdateUrl).not.toHaveBeenCalled();
    });
  });

  describe('getTabStyles', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear all mocks before each test
    });
    it('Should return the correct styles for a tab', () => {
      // Arrange
      const config = {
        ...mockConfig,
        showErrorState: true,
        isActiveTab: true
      };

      // Act
      const result = getTabStyleClass(config);

      // Assert
      expect(result).toContain(styles.error_state);
      expect(result).toContain(styles.is_active_tab);
    });
  });
});
