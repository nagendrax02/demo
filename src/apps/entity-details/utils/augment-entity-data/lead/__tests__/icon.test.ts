import { getAugmentedIcon } from '../vcard';
import { IEntity } from 'common/types';
import { IconContentType } from '../../../../types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';

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

describe('getAugmentedIcon', () => {
  it('Should return valid icon config when image url is passed', () => {
    // Act
    const result = getAugmentedIcon(testEntityData);

    // Assert
    expect(result).toEqual({
      content: 'https://example.com/photo.jpg',
      contentType: IconContentType.Image
    });
  });

  it('Should return valid icon config when firstname and lastname is passed', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.PHOTO_URL]: null
        }
      }
    };

    // Act
    const result = getAugmentedIcon(mockData);

    // Assert
    expect(result).toEqual({
      content: 'JD',
      contentType: IconContentType.Text
    });
  });

  it('Should return valid icon config when only firstname is present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.PHOTO_URL]: null,
          [LEAD_SCHEMA_NAME.LAST_NAME]: null
        }
      }
    };

    // Act
    const result = getAugmentedIcon(mockData);

    // Assert
    expect(result).toEqual({
      content: 'J',
      contentType: IconContentType.Text
    });
  });

  it('Should return valid icon config when only lastname is present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.PHOTO_URL]: null,
          [LEAD_SCHEMA_NAME.FIRST_NAME]: null
        }
      }
    };

    // Act
    const result = getAugmentedIcon(mockData);

    // Assert
    expect(result).toEqual({
      content: 'D',
      contentType: IconContentType.Text
    });
  });

  it('Should return valid icon config with empty content when firstname, lastname and image url are not present', () => {
    // Arrange
    const mockData: IEntity = {
      ...testEntityData,
      details: {
        ...testEntityData.details,
        Fields: {
          ...testEntityData.details.Fields,
          [LEAD_SCHEMA_NAME.PHOTO_URL]: null,
          [LEAD_SCHEMA_NAME.FIRST_NAME]: null,
          [LEAD_SCHEMA_NAME.LAST_NAME]: null
        }
      }
    };

    // Act
    const result = getAugmentedIcon(mockData);

    // Assert
    expect(result).toEqual({
      content: '',
      contentType: IconContentType.Text
    });
  });
});
