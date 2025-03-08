import { API_ROUTES } from 'src/common/constants';
import { fetchOption, getBody, invokeApi } from '../utils';
import { Module } from 'src/common/utils/rest-client';
import { CREATE_NEW_LIST, DataType, IInvokeApi } from '../add-to-list.types';
import * as restClient from 'common/utils/rest-client';

//Arrange
jest.mock('src/common/utils/rest-client', () => ({
  Module: {
    Marvin: 'MARVIN'
  },
  httpPost: jest.fn(() => Promise.resolve({})),
  CallerSource: {}
}));

const mockedResponse = [
  {
    dataType: 'SearchableDropdown',
    label: 'Starred lead',
    value: '84e1c314-1ebc-11ee-b4de-02e6b6b64584'
  }
];

const mockedApiResult = [
  {
    SimplifiedSQLDefinition: null,
    CreatedOnString: '2023-07-10 00:55:52',
    ModifiedOnString: '2023-12-28 12:33:45',
    ID: '84e1c314-1ebc-11ee-b4de-02e6b6b64584',
    Name: 'Starred Leads',
    Description: 'List of leads which are Starred by you.',
    Definition:
      '{"GrpConOp": "And","Conditions": [{"Type": "Lead","ConOp": "or","RowCondition": [{"SubConOp": "And","LSO": "ProspectId","LSO_Type": "String","Operator": "eq","RSO": ""},{},{}]}],"QueryTimeZone": "India Standard Time" }',
    MemberCount: 2,
    EntityName: 'Lead',
    IsSystemGenerated: false,
    OwnerID: '84df4718-1ebc-11ee-b4de-02e6b6b64584',
    CreatedBy: '84df4718-1ebc-11ee-b4de-02e6b6b64584',
    CreatedOn: '2023-07-10T00:55:52',
    ModifiedBy: '84df4718-1ebc-11ee-b4de-02e6b6b64584',
    ModifiedOn: '2023-12-28T12:33:45',
    OwnerIdName: 'praveen user',
    CreatedByName: 'praveen user',
    ModifiedByName: 'praveen user',
    Total: 35,
    IsPrivate: 1,
    InternalName: 'Starred Leads',
    CreatedByEmail: 'praveen48849@lsqdev.in',
    ModifiedByEmail: 'praveen48849@lsqdev.in'
  }
];

describe('fetchOption', () => {
  it('Should fetch option when API succeed', async () => {
    //Arrange
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    //Act
    const result = await fetchOption({});

    //Assert
    expect(result).toStrictEqual(mockedResponse);
    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.list,
      module: Module.Marvin,
      body: {
        SearchText: undefined,
        PageSize: '99999',
        PageIndex: 1,
        ListType: 0,
        SortColumn: 'CreatedOn',
        SortOrder: 1
      }
    });
  });

  test('Should handle error when API fails', async () => {
    //Arrange
    jest.mock('src/common/utils/rest-client', () => ({
      Module: {
        Marvin: 'MARVIN'
      },
      httpPost: jest.fn(() => Promise.reject({})),
      CallerSource: {}
    }));

    //Act
    const options = await fetchOption({});
    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.list,
      module: Module.Marvin,
      body: {
        SearchText: undefined,
        PageSize: '99999',
        PageIndex: 1,
        ListType: 0,
        SortColumn: 'CreatedOn',
        SortOrder: 1
      }
    });

    //Assert
    expect(options).toEqual([]);
  });
});

describe('getBody', () => {
  it('should return body for when selected creating a new list', () => {
    //Arrange
    const props = {
      leadIds: ['123'],
      selectedOption: CREATE_NEW_LIST.value,
      listName: 'New List',
      message: 'List description',
      LeadType: ''
    };

    //Act
    const result = getBody(props);

    //Assert
    expect(result).toEqual({
      Name: 'New List',
      Description: 'List description',
      Definition: '',
      CreateEmptyList: true,
      LeadType: ''
    });
  });

  it('should return body when selected any other list list', () => {
    //Arrange
    const props = {
      leadIds: ['123'],
      selectedOption: 'existingListId',
      listName: 'Existing List',
      message: 'List description',
      LeadType: ''
    };

    //Act
    const result = getBody(props);

    //Assert
    expect(result).toEqual({
      LeadIds: ['123'],
      LeadRetrieveCriteria: undefined,
      UpdateAll: false,
      Nleads: 0,
      ListId: 'existingListId',
      IsStaticList: true,
      LeadType: ''
    });
  });
});

describe('invokeApi', () => {
  it('should invoke createList API with correct parameters when selectedValue is CREATE_NEW_LIST', async () => {
    //Arrange
    const props: IInvokeApi = {
      leadIds: ['123'],
      selectedValue: CREATE_NEW_LIST.value,
      listName: 'New List',
      message: 'List description',
      bulkSelectionMode: {},
      settingConfig: {
        BulkLeadUpdateCount: '',
        EnableNLeadsFeature: '',
        MaxNLeadsToUpdateInSync: ''
      }
    };

    //Act
    await invokeApi(props);

    //Assert
    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.createList,
      module: Module.Platform,
      body: {
        Name: 'New List',
        Description: 'List description',
        Definition: '',
        CreateEmptyList: true,
        LeadType: ''
      }
    });
  });

  it('should invoke addToList API with correct parameters when selectedValue is not CREATE_NEW_LIST', async () => {
    //Arrange
    const props: IInvokeApi = {
      leadIds: ['123'],
      selectedValue: 'existingListId',
      listName: 'Existing List',
      message: 'List description',
      bulkSelectionMode: {},
      settingConfig: {
        BulkLeadUpdateCount: '',
        EnableNLeadsFeature: '',
        MaxNLeadsToUpdateInSync: ''
      }
    };

    //Act
    await invokeApi(props);

    //Assert
    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.addToList,
      module: Module.Marvin,
      body: {
        LeadIds: ['123'],
        LeadRetrieveCriteria: undefined,
        UpdateAll: false,
        Nleads: 0,
        ListId: 'existingListId',
        IsStaticList: true,
        LeadType: ''
      }
    });
  });

  it('should handle errors and log them to the console when API fail', async () => {
    //Arrange
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const props: IInvokeApi = {
      leadIds: ['123'],
      selectedValue: 'existingListId',
      listName: 'Existing List',
      message: 'List description',
      bulkSelectionMode: {},
      settingConfig: {
        BulkLeadUpdateCount: '',
        EnableNLeadsFeature: '',
        MaxNLeadsToUpdateInSync: ''
      }
    };

    //Act
    (restClient.httpPost as jest.Mock).mockRejectedValue(new Error('API Error'));
    await invokeApi(props);

    //Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
  });
});
