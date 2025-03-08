import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { getAugmentedBadge } from '../vcard';
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

describe('getAugmentedBadge', () => {
  it('Should return the valid badge config', () => {
    // Act
    const result = getAugmentedBadge(testEntityData);

    // Assert
    expect(result).toEqual({ content: 'TestStage' });
  });
});
