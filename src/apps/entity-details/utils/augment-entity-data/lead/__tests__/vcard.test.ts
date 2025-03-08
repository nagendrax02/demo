import { getAugmentedVCard } from '../vcard';
import { MOCK_AUGMENTED_ENTITY_DATA, MOCK_ENTITY_DATA } from './mock-configs';

describe('getAugmentedVCard', () => {
  it('Should return the valid vCard config', () => {
    // Act
    const result = getAugmentedVCard(MOCK_ENTITY_DATA);

    // Assert
    expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_AUGMENTED_ENTITY_DATA.vcard));
  });
});
