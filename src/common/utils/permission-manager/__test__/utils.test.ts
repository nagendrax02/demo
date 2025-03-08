import { AccessType, ActionType, PermissionEntityType } from '../permission-manager.types';
import { checkViewPermission, getEntityPermission, isFieldRestricted } from '../utils';

//Arrange
const configTestOne = {
  entityPermission: {
    Access: 'NOACCESS' as AccessType,
    RestrictedFields: {}
  },
  schemaName: 'OwnerId'
};

const configTestTwo = {
  entityPermission: {
    Access: 'FULLACCESS' as AccessType,
    RestrictedFields: {}
  },
  schemaName: 'OwnerId'
};

const actionPermission = {
  LEAD: {
    Access: 'NOACCESS' as AccessType,
    RestrictedFields: {}
  }
};

const entity = 'LEAD' as PermissionEntityType;

const returnObj = {
  Access: 'NOACCESS',
  RestrictedFields: {}
};

describe('isFieldRestricted', () => {
  it('Should return true when Access is Restricted', () => {
    //Act & Assert
    expect(isFieldRestricted(configTestOne)).toBe(true);
  });

  it('Should return false when Access is not Restricted', () => {
    //Act & Assert
    expect(isFieldRestricted(configTestTwo)).toBe(false);
  });
});

describe('getEntityPermission', () => {
  it('Should return expected object when default props is provided', () => {
    //Act & Assert
    expect(getEntityPermission(actionPermission, entity)).toStrictEqual(returnObj);
  });
});

describe('checkViewPermission', () => {
  it('Should return true when action is Update', () => {
    //Act & Assert
    expect(checkViewPermission(entity, 'update' as ActionType)).toStrictEqual(true);
  });

  it('Should return false when action is other than update', () => {
    //Act & Assert
    expect(checkViewPermission(entity, 'Delete' as ActionType)).toStrictEqual(false);
  });
});
