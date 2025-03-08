import * as lead from '../lead';
import { ILeadDetails, ILeadMetaData } from 'common/types';
import * as metaDataUtils from '../metadata';
import * as detailUtils from '../details';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { ILeadAttribute } from 'src/common/types/entity/lead';

const testDetails: ILeadDetails = {
  Fields: {},
  VCardConfiguration: { DisplayName: '', Sections: [] },
  ActionsConfiguration: [],
  TabsConfiguration: [],
  LeadDetailsConfiguration: { Sections: [] },
  ConnectorConfiguration: {},
  SettingConfiguration: {}
};

const testMetaData: ILeadMetaData = {
  Fields: [],
  LeadRepresentationConfig: {
    SingularName: '',
    PluralName: ''
  }
};

const testError = new Error('test error');

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('fetchData', () => {
  it('Should return ILeadData when details and metaData is fetched', async () => {
    // Arrange
    jest.spyOn(detailUtils, 'fetchDetails').mockResolvedValueOnce(testDetails);
    jest
      .spyOn(metaDataUtils, 'fetchMetaData')
      .mockResolvedValueOnce(
        createHashMapFromArray<ILeadAttribute>(testMetaData.Fields || [], 'SchemaName')
      );
    jest
      .spyOn(metaDataUtils, 'fetchRepresentationName')
      .mockResolvedValueOnce(testMetaData.LeadRepresentationConfig);

    // Act
    const result = await lead.fetchData();

    // Assert
    expect(detailUtils.fetchDetails).toHaveBeenCalledTimes(1);
    expect(metaDataUtils.fetchMetaData).toHaveBeenCalledTimes(1);
    expect(metaDataUtils.fetchRepresentationName).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      details: testDetails,
      metaData: testMetaData
    });
  });

  it('Should handle errors when error occurs', async () => {
    // Act
    jest.spyOn(detailUtils, 'fetchDetails').mockRejectedValueOnce(testError);

    // Assert
    expect(() => lead.fetchData()).rejects.toThrowError();
  });
});
