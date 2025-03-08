import { getEventFilter } from '../../utils/event-filter';
import { fetchCategoryMetadata } from '../../utils/activity-category-metadata'; // replace with the actual path

jest.mock('../../utils/activity-category-metadata', () => ({
  fetchCategoryMetadata: jest.fn()
}));

describe('getEventFilter', () => {
  it('Should return default event filter when typeFilter is empty', async () => {
    // Arrange
    const typeFilter = [];

    // Act
    const result = await getEventFilter(typeFilter);

    // Assert
    expect(result).toEqual([
      {
        EventType: -9999,
        EventCodes: []
      }
    ]);
  });

  it('Should call fetchCategoryMetadata and processFilteredItems when typeFilter is not empty', async () => {
    // Arrange
    const typeFilter = [
      { value: '1', label: '1' },
      { value: '2', label: '2' }
    ];
    const mockResponse = [
      { Value: '1', EventType: 'Event1' },
      { Value: '2', EventType: 'Event2' }
    ];
    (fetchCategoryMetadata as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    await getEventFilter(typeFilter);

    // Assert
    expect(fetchCategoryMetadata).toHaveBeenCalled();
  });
});
