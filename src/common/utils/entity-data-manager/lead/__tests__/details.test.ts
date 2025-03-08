import * as detailUtils from '../details';
import * as helperUtils from 'common/utils/helpers';
import * as restClient from 'common/utils/rest-client';
import { ILeadDetails } from 'common/types/entity';
import { CallerSource } from 'common/utils/rest-client';

const testLeadDetails: ILeadDetails = {
  Fields: { testProperty: 'testValue' },
  ActionsConfiguration: [],
  TabsConfiguration: [],
  VCardConfiguration: {
    DisplayName: 'testVCard',
    Sections: []
  },
  ConnectorConfiguration: {},
  LeadDetailsConfiguration: {
    Sections: []
  }
};

const testLeadId = 'test-lead-id';

const testRequestBody = {
  Id: testLeadId,
  CanGetFormConfiguration: true,
  CanGetTabConfiguration: true,
  CanGetActionConfiguration: true,
  CanGetSettingConfiguration: true
};

const testError = new Error('Test Error');

describe('fetchDetails', () => {
  it('Should fetch lead details successfully', async () => {
    // Arrange
    const mockFetchDetails = jest
      .spyOn(detailUtils, 'fetchDetails')
      .mockResolvedValue(testLeadDetails);

    // Act
    const response = await detailUtils.fetchDetails(CallerSource.LeadDetails);

    // Assert
    expect(response).toBe(testLeadDetails);
    mockFetchDetails.mockRestore();
  });

  it('Should throw an error when the API call fails', async () => {
    // Arrange
    jest.spyOn(helperUtils, 'getEntityId').mockReturnValue(testLeadId);
    jest.spyOn(helperUtils, 'isValidGuid').mockReturnValue(true);
    jest.spyOn(detailUtils, 'getLeadDetailsRequestBody').mockReturnValue(testRequestBody);
    jest.spyOn(restClient, 'httpPost').mockRejectedValue(testError);

    // Act & Assert
    await expect(detailUtils.fetchDetails(CallerSource.LeadDetails)).rejects.toThrow(testError);
  });
});
