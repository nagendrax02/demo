import * as restClient from 'common/utils/rest-client';
import { OptionCategory } from '../send-email.types';
import styles from '../send-email.module.css';
import { fetchCcBccOptions } from '../utils/fetch-data';
import { mockRepresentationName } from '../constants';

describe('fetchCcBccOptions', () => {
  it('Should return augmented data when api is successful', async () => {
    // Arrange
    const mockResponse = [
      {
        Value: '1',
        Label: 'Test',
        category: OptionCategory.Lead,
        Data: 'test@example.com',
        HtmlAttributes: { DoNotEmail: '0' }
      }
    ];
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockResponse);

    // Act
    const result = await fetchCcBccOptions({
      searchText: 'test',
      leadRepresentationName: mockRepresentationName,
      callerSource: restClient.CallerSource.NA,
      toFieldData: []
    });

    // Assert
    expect(result).toEqual([
      {
        label: 'Test',
        value: '1',
        group: OptionCategory.Lead,
        disabled: false,
        secondaryLabel: '(test@example.com)',
        menuTooltipMessage: undefined,
        inputTooltipMessage: 'test@example.com',
        inputCustomStyleClass: styles.lead_selected_option
      }
    ]);
  });

  it('Should return an empty array when api fails', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpPost').mockRejectedValue(new Error('Fetch error'));

    // Act
    const result = await fetchCcBccOptions({
      searchText: 'test',
      leadRepresentationName: mockRepresentationName,
      callerSource: restClient.CallerSource.NA,
      toFieldData: []
    });

    // Assert
    expect(result).toEqual([]);
  });
});
