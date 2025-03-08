import { convertArrayToObject, getPermissionTemplate } from '../permission-normalization';
import * as StorageManager from 'common/utils/storage-manager';
import { API_ROUTES } from 'src/common/constants';
import * as restClient from 'common/utils/rest-client';
const { Module } = restClient;

//Arrange
jest.mock('common/utils/rest-client', () => ({
  httpGet: jest.fn(),
  httpPost: jest.fn(),
  Module: {
    Marvin: 'MARVIN'
  },
  CallerSource: {}
}));

jest.mock('common/utils/storage-manager', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  StorageKey: {
    UserName: 'permissions'
  }
}));

const testInput = [
  'ActivityEvent_Note',
  'Status',
  'mx_Custom_2',
  'mx_Custom_19',
  'mx_Custom_10',
  'mx_Custom_8',
  'mx_Custom_9',
  'mx_Custom_4',
  'mx_Custom_12'
];

const testOutput = {
  ActivityEvent_Note: 'ActivityEvent_Note',
  Status: 'Status',
  mx_Custom_2: 'mx_Custom_2',
  mx_Custom_19: 'mx_Custom_19',
  mx_Custom_10: 'mx_Custom_10',
  mx_Custom_8: 'mx_Custom_8',
  mx_Custom_9: 'mx_Custom_9',
  mx_Custom_4: 'mx_Custom_4',
  mx_Custom_12: 'mx_Custom_12'
};

const mockedPermissionResponse = {
  UserId: '123',
  CREATE: {
    LEAD: {
      Access: 'FULLACCESS',
      RestrictedFields: {},
      RestrictedTypes: null
    }
  },
  UserLevelAccess: {
    Task: ['0ee8d44b-dfa0-11ee-9888-02eefa84bd20']
  }
};

const mockedApiResult = {
  UserId: '123',
  EntityPermissions: [
    {
      Entity: 'Lead',
      Permissions: [
        {
          Action: 'Create',
          Access: 'FullAccess',
          Properties: {
            Restrictions: []
          }
        }
      ],
      EntityType: null
    },
    {
      Entity: 'Task',
      Permissions: [
        {
          Action: null,
          Access: null,
          Properties: {
            Restrictions: [],
            ModifiableTaskUsers: ['0ee8d44b-dfa0-11ee-9888-02eefa84bd20']
          }
        }
      ],
      EntityType: null
    }
  ]
};

describe('ConvertArrayToObject', () => {
  it('Should return object when input provided is string array or number array', () => {
    //Act & Assert
    expect(convertArrayToObject(testInput)).toEqual(testOutput);
  });
});

describe('getPermissionTemplate', () => {
  it('Should return permission when available in storage', async () => {
    jest.spyOn(StorageManager, 'getItem').mockReturnValueOnce(mockedPermissionResponse);

    const result = await getPermissionTemplate(restClient.CallerSource.NA);

    expect(result).toEqual({ ...mockedPermissionResponse });
    expect(StorageManager.getItem).toHaveBeenCalledWith(StorageManager.StorageKey.Permissions);
    expect(restClient.httpPost).toHaveBeenCalledTimes(0);
    expect(StorageManager.setItem).toHaveBeenCalledTimes(0);
  });

  it('Should fetch permission from storage and API when permissions not available in storage', async () => {
    //Arrange
    jest.spyOn(restClient, 'httpGet').mockResolvedValueOnce(mockedApiResult);

    // Act
    const result = await getPermissionTemplate(restClient.CallerSource.NA);

    // Assert
    expect(result).toEqual({ ...mockedPermissionResponse });
    expect(StorageManager.getItem).toHaveBeenCalledWith(StorageManager.StorageKey.Permissions);
    expect(restClient.httpGet).toHaveBeenCalledWith({
      path: API_ROUTES.permission,
      module: Module.Marvin
    });
    expect(StorageManager.setItem).toHaveBeenCalledWith(
      StorageManager.StorageKey.Permissions,
      mockedPermissionResponse
    );
  });
});
