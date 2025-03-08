import {
  getDefaultColumnConfig,
  getNewAndOldValueColumnConfig,
  getOppCaptureColumnConfig,
  getMediumColumnConfig
} from '../../config/column-config';

describe('column-config', () => {
  it('Should return default column config', () => {
    // Arrange
    const expected = [
      { field: 'Field', key: 'DisplayName', width: 150 },
      { field: 'Value', key: 'Value', width: 300 }
    ];

    // Act
    const result = getDefaultColumnConfig();

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return new and old value column config', () => {
    // Arrange
    const expected = [
      { field: 'Field', key: 'DisplayName', width: 200 },
      { field: 'Old Value', key: 'OldValue', width: 200 },
      { field: 'New Value', key: 'NewValue', width: 200 }
    ];

    // Act
    const result = getNewAndOldValueColumnConfig();

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return opportunity capture column config', () => {
    // Arrange
    const expected = [
      { field: 'Field', key: 'DisplayName', width: 200 },
      { field: 'Value', key: 'Value', width: 500 }
    ];

    // Act
    const result = getOppCaptureColumnConfig();

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return medium column config', () => {
    // Arrange
    const expected = [
      { field: 'Field', key: 'DisplayName', width: 150 },
      { field: 'Value', key: 'Value', width: 350 }
    ];

    // Act
    const result = getMediumColumnConfig();

    // Assert
    expect(result).toEqual(expected);
  });
});
