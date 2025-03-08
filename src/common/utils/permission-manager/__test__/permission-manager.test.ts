import { isRestricted } from '../permission-manager';
import * as restClient from 'common/utils/rest-client';
import { ActionType, PermissionEntityType } from '../permission-manager.types';

const testInputWithoutRestriction = {
  entity: 'LEAD' as PermissionEntityType,
  action: 'CREATE' as ActionType,
  callerSource: restClient.CallerSource.NA
};

const mockedApiResultWithoutRestriction = {
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
    }
  ]
};

const testInputWithRestriction = {
  entity: 'LEAD' as PermissionEntityType,
  action: 'UPDATE' as ActionType
};

const mockedApiResultWithRestriction = {
  UserId: '123',
  EntityPermissions: [
    {
      Entity: 'Lead',
      Permissions: [
        {
          Action: 'Update',
          Access: 'NoAccess',
          Properties: {
            Restrictions: []
          }
        }
      ],
      EntityType: null
    }
  ]
};

describe('isRestricted', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Should return false when input provided is not restricted', async () => {
    const httpGetMock = jest
      .spyOn(restClient, 'httpGet')
      .mockResolvedValueOnce(mockedApiResultWithoutRestriction);

    const result = await isRestricted(testInputWithoutRestriction);

    expect(result).toBe(false);
  });
});
