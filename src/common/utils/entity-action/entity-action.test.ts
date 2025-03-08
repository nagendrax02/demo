import { EntityType } from 'common/types';
import {
  canRemoveAction,
  getEntityActionConfig,
  getOwnerSchemaName,
  getPermissionEntityType
} from './entity-action';
import { PermissionEntityType } from 'common/utils/permission-manager/permission-manager.types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { ActionRenderType } from 'src/apps/entity-details/types';
import * as isRestricted from '../permission-manager';
import { CallerSource } from '../rest-client';

describe('getPermissionEntityType', () => {
  it('Should return permission entity typpe when entity type provided', () => {
    //Act & Assert
    expect(getPermissionEntityType('lead' as EntityType)).toBe(PermissionEntityType.Lead);
  });
});

describe('getOwnerSchemaName', () => {
  it('Should return proper owner schema name when entity type is opportunity', () => {
    //Act & Assert
    expect(getOwnerSchemaName('opportunity' as EntityType)).toBe(LEAD_SCHEMA_NAME.OWNER);
  });

  it('Should return proper owner schema name when entity type other than opportunity', () => {
    //Act & Assert
    expect(getOwnerSchemaName('lead' as EntityType)).toBe(LEAD_SCHEMA_NAME.OWNER_ID);
  });
});

//Arrange
const name = 'ChangeOwner';
const nameTest = 'RemoveFromList';

const permission = {
  isUpdateActionRestricted: true,
  isDeleteActionRestricted: true,
  isManageListRestricted: true
};

describe('canRemoveAction', () => {
  it('Should return true when access is restricted for update and delete and provided action is update type action', () => {
    //Act & Assert
    expect(canRemoveAction(name, permission)).toBe(true);
  });

  it('Should return false when access is restricted for update and delete but action is not of update kind action', () => {
    //Act & Assert
    expect(canRemoveAction(nameTest, permission)).toBe(false);
  });
});

//Arrange
const tesInputData = {
  configData: [
    {
      id: 'Activity',
      title: 'Activity',
      type: 'Button' as ActionRenderType,
      sequence: 0,
      renderAsIcon: false,
      actionHandler: {}
    },
    {
      id: 'ChangeOwner',
      title: 'Change Owner',
      type: 'Dropdown' as ActionRenderType,
      sequence: 3,
      renderAsIcon: false,
      actionHandler: {}
    },
    {
      id: 'ChangeStage',
      title: 'Change Stage',
      type: 'Dropdown' as ActionRenderType,
      sequence: 4,
      renderAsIcon: false,
      actionHandler: {}
    },
    {
      id: 'Edit',
      title: 'Edit',
      type: 'Dropdown' as ActionRenderType,
      sequence: 11,
      renderAsIcon: false,
      actionHandler: {}
    }
  ],
  entityType: 'lead' as EntityType,
  canUpdate: true,
  callerSource: CallerSource.NA
};

const testOutputData = [
  {
    id: 'Activity',
    title: 'Activity',
    type: 'Button',
    sequence: 0,
    renderAsIcon: false,
    actionHandler: {}
  }
];

describe('getEntityActionConfig', () => {
  it('Should return filtered data from all the config data when action is restricted', async () => {
    //Act
    jest.spyOn(isRestricted, 'isRestricted').mockReturnValueOnce(Promise.resolve(true));

    const result = await getEntityActionConfig(tesInputData);

    // Assert
    expect(result).toEqual(testOutputData);
  });
});
