import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { getAugmentedTitle } from '../vcard';
import { IEntity } from 'common/types';

const testEntityData: IEntity = {
  details: {
    Fields: {
      [LEAD_SCHEMA_NAME.PHOTO_URL]: 'https://example.com/photo.jpg',
      [LEAD_SCHEMA_NAME.FIRST_NAME]: 'John',
      [LEAD_SCHEMA_NAME.LAST_NAME]: 'Doe',
      [LEAD_SCHEMA_NAME.EMAIL_ADDRESS]: 'john.doe@example.com',
      [LEAD_SCHEMA_NAME.PROSPECT_STAGE]: 'TestStage'
    },
    VCardConfiguration: { DisplayName: '', Sections: [] },
    ActionsConfiguration: [],
    TabsConfiguration: [],
    LeadDetailsConfiguration: {
      Sections: []
    },
    ConnectorConfiguration: {}
  },
  metaData: {}
};

describe('getAugmentedTitle', () => {
  it('Should return the valid title config when firstname and lastname is present', () => {
    // Act
    const result = getAugmentedTitle(testEntityData);

    // Assert
    expect(result).toEqual({ content: 'John Doe' });
  });
  it('Should return the valid title config when only firstname is present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.LAST_NAME]: null
        }
      }
    };

    // Act
    const result = getAugmentedTitle(mockData);

    // Assert
    expect(result).toEqual({ content: 'John' });
  });

  it('Should return the valid title config when only lastname is present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.FIRST_NAME]: null
        }
      }
    };

    // Act
    const result = getAugmentedTitle(mockData);

    // Assert
    expect(result).toEqual({ content: 'Doe' });
  });

  it('Should return the valid title config when only emailid is present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.FIRST_NAME]: null,
          [LEAD_SCHEMA_NAME.LAST_NAME]: null,
          [LEAD_SCHEMA_NAME.EMAIL_ADDRESS]: null
        }
      }
    };

    // Act
    const result = getAugmentedTitle(mockData);

    // Assert
    expect(result).toEqual({ content: '[No Name]' });
  });

  it('Should return the valid title config when firstname, lastname and emailid are not present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.FIRST_NAME]: null,
          [LEAD_SCHEMA_NAME.LAST_NAME]: null
        }
      }
    };

    // Act
    const result = getAugmentedTitle(mockData);

    // Assert
    expect(result).toEqual({ content: '[No Name]' });
  });
});
