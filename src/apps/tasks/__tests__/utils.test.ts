import { fetchNextPage } from '../utils/tasks';
import * as restClient from '../../../common/utils/rest-client';
import { tasks } from '../__mocks__/data';

describe('Tasks utils', () => {
  it('Should fetch next page', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue({ Data: tasks });

    // Act
    await fetchNextPage({
      pageNumber: 2,
      setTasksList: jest.fn(),
      currentTasks: [],
      date: {
        startDate: undefined,
        endDate: undefined
      },
      statusCode: -1,
      leadId: 'a50eba4c-7dfd-4dd0-9c85-95b6ea9dd13c',
      showAlert: jest.fn()
    });

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });
});
