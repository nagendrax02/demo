import {
  getActiveTabTitle,
  getActiveTabIconType,
  createNewAppTabConfig,
  isValidPath
} from '../utils/hook-utils';
import { TabIconType } from '../app-tabs.types';
import { DefaultAppTitles } from '../constants';
import { APP_ROUTE } from 'common/constants';

jest.mock('common/utils/helpers/helpers', () => ({
  getEntityId: jest.fn()
}));

describe('Hook Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/test-path', search: '?testid=123' }
    });
  });

  describe('getActiveTabTitle', () => {
    it('Should return the correct title for a known path', () => {
      // Act
      const result = getActiveTabTitle(APP_ROUTE.leadDetails, 1);

      // Assert
      expect(result).toBe(DefaultAppTitles[APP_ROUTE.leadDetails]);
    });

    it('Should return "New Tab" for an unknown path', () => {
      // Act
      const result = getActiveTabTitle('unknownPath', 2);

      // Assert
      expect(result).toBe('New Tab - 2');
    });
  });

  describe('getActiveTabIconType', () => {
    it('Should return the correct icon type for a known path', () => {
      // Act
      const result = getActiveTabIconType(APP_ROUTE.leadDetails);

      // Assert
      expect(result).toBe(TabIconType.Lead);
    });

    it('Should return TabIconType.Custom for an unknown path', () => {
      // Act
      const result = getActiveTabIconType('unknownPath');

      // Assert
      expect(result).toBe(TabIconType.Custom);
    });
  });

  describe('getActiveTabConfig', () => {
    it('Should return the correct tab config for a known path', () => {
      // Act
      const result = createNewAppTabConfig(APP_ROUTE.leadDetails, 1);

      // Assert
      expect(result).toEqual({
        id: '/test-path?testid=123',
        title: DefaultAppTitles[APP_ROUTE.leadDetails],
        url: window.location.href,
        isActiveTab: true,
        iconType: TabIconType.Lead
      });
    });
  });

  describe('isValidPath', () => {
    it('Should return true for a valid path', () => {
      // Act
      const result = isValidPath(APP_ROUTE.leadDetails);

      // Assert
      expect(result).toBe(true);
    });

    it('Should return false for an invalid path', () => {
      // Act
      const result = isValidPath('invalidPath');

      // Assert
      expect(result).toBe(false);
    });
  });
});
