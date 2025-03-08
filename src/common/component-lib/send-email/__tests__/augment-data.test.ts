import { OptionCategory } from '../send-email.types';
import styles from '../send-email.module.css';
import { getToField } from '../utils/augment-data';
import * as fetchDataUtils from '../utils/fetch-data';
import { CallerSource } from 'src/common/utils/rest-client';

describe('getToField', () => {
  it('Should return augmented "to" Field data', () => {
    // Arrange
    const mockToField = [
      {
        label: 'Test',
        value: 'test@example.com'
      }
    ];
    jest.spyOn(fetchDataUtils, 'getUnblockedLeads').mockResolvedValue(mockToField);

    // Act
    const result = getToField({
      toField: mockToField,
      emailFields: [],
      selectedEmailCategory: { label: '', value: '' },
      showAlert: () => {},
      callerSource: CallerSource.NA
    });

    // Assert
    expect(result).resolves.toEqual([
      {
        label: 'Test',
        value: 'test@example.com',
        group: OptionCategory.Lead,
        inputCustomStyleClass: styles.lead_selected_option,
        inputTooltipMessage: 'Lead'
      }
    ]);
  });
});
