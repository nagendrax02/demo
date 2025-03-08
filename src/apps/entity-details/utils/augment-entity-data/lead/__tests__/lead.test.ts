import augmentedLeadData from '../lead';
import { MOCK_AUGMENTED_ENTITY_DATA, MOCK_ENTITY_DATA } from './mock-configs';

describe('augmentedLeadData', () => {
  it('Should return an augmented data when raw data is passed', () => {
    // Act & Assert
    expect(JSON.stringify(augmentedLeadData(MOCK_ENTITY_DATA))).toEqual(
      JSON.stringify(MOCK_AUGMENTED_ENTITY_DATA)
    );
  });
});
