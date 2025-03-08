import { fireEvent, render, waitFor, screen, queryByTestId } from '@testing-library/react';
import Tasks from '../Tasks';
import * as taskUtils from '../utils/tasks';
import * as markComplete from '../utils/markcomplete';
import * as restClient from 'common/utils/rest-client';
import * as permissionManagerUtils from 'common/utils/permission-manager/utils';
import * as permissionManager from 'common/utils/permission-manager';
import { tasks } from '../__mocks__/data';
import { ITaskItem } from '../tasks.types';
import * as overdue from '../utils/overdue';
import { TAB_ID } from 'common/component-lib/entity-tabs/constants/tab-id';
import { DEFAULT_ENTITY_IDS, MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from 'common/component-lib/send-email/constants';

const observe = jest.fn();
const unobserve = jest.fn();

// Mock the IntersectionObserver
class IntersectionObserverMock {
  observe = observe;
  unobserve = unobserve;
}

const mockHoverEvent = (testId) => {
  fireEvent.mouseOver(screen.getByTestId(testId));
};

describe('Tasks tab', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();

    // Arrange
    jest.spyOn(taskUtils, 'fetchTasks').mockResolvedValue({
      tasksList: tasks.slice(0, 1) as unknown as ITaskItem[],
      totalTasks: 1
    });
    window.IntersectionObserver = IntersectionObserverMock as any;
  });

  // it('Should render default page when no tasks are available', async () => {
  //   // Arrange
  //   jest.spyOn(taskUtils, 'fetchTasks').mockResolvedValue({
  //     tasksList: [],
  //     totalTasks: 0
  //   });
  //   const { queryByTestId } = render(<Tasks tabId={TAB_ID.LeadTasks} />);

  //   // Assert
  //   await waitFor(() => {
  //     expect(queryByTestId('default-page-add-tasks')).toBeInTheDocument();
  //   });
  // });

  it('Should render tasks timeline when tasks are available', async () => {
    // Arrange
    const { queryByTestId } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('default-page-add-tasks')).not.toBeInTheDocument();
      expect(queryByTestId('timeline-group')).toBeInTheDocument();
    });
  });

  // --> Need to uncomment later
  // it('Should show all Actions on hover when no action restrictions are applied', async () => {
  //   // Arrange
  //   const { queryByTestId } = render(<Tasks tabId={TAB_ID.LeadTasks} />);

  //   // Act
  //   await waitFor(() => {
  //     mockHoverEvent('timeline');
  //   });

  //   // Assert
  //   await waitFor(() => {
  //     expect(queryByTestId('tasks-delete-action')).toBeInTheDocument();
  //     expect(queryByTestId('tasks-edit-action')).toBeInTheDocument();
  //     expect(queryByTestId('tasks-mark-task')).toBeInTheDocument();
  //   });
  // });

  it('Should show overdue in days when due date difference is in days', async () => {
    // Arrange
    jest.spyOn(overdue, 'differenceInMinutes').mockReturnValue(3000);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByText('Days Overdue 2')).toBeInTheDocument();
    });
  });

  it('Should show overdue as day when due date difference is a day', async () => {
    // Arrange
    jest.spyOn(overdue, 'differenceInMinutes').mockReturnValue(1500);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByText('Day Overdue 1')).toBeInTheDocument();
    });
  });

  it('Should show overdue in hours when due date difference is in hours', async () => {
    // Arrange
    jest.spyOn(overdue, 'differenceInMinutes').mockReturnValue(300);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByText('Hours Overdue 5')).toBeInTheDocument();
    });
  });

  it('Should show overdue as hour when due date difference is an hour', async () => {
    // Arrange
    jest.spyOn(overdue, 'differenceInMinutes').mockReturnValue(60);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByText('Hour Overdue 1')).toBeInTheDocument();
    });
  });

  it('Should show overdue in minutes when due date difference is in minutes', async () => {
    // Arrange
    jest.spyOn(overdue, 'differenceInMinutes').mockReturnValue(25);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByText('Minutes Overdue 25')).toBeInTheDocument();
    });
  });

  it('Should show overdue as minute when due date difference is a minute', async () => {
    // Arrange
    jest.spyOn(overdue, 'differenceInMinutes').mockReturnValue(1);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByText('Minute Overdue 1')).toBeInTheDocument();
    });
  });

  it('Should not show mark open action when OpenCompletedTasks is not allowed and task is completed', async () => {
    // Arrange
    jest.spyOn(taskUtils, 'fetchTasks').mockResolvedValue({
      tasksList: tasks.slice(2, 3) as unknown as ITaskItem[],
      totalTasks: 1
    });
    const { queryByTestId } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
    });

    // Assert
    await waitFor(() => {
      expect(queryByTestId('tasks-mark-task')).not.toBeInTheDocument();
    });
  });

  it('Should remove task item on delete when delete is not restricted', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpGet').mockImplementation(jest.fn());
    jest.spyOn(permissionManagerUtils, 'isTypeRestricted').mockReturnValue(false);
    const { getByTestId } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('tasks-delete-action'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('yes-delete-tasks'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText(tasks[0].Description)).not.toBeInTheDocument();
    });
  });

  it('Should not remove task item on click of delete icon when delete is restricted', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpGet').mockImplementation(jest.fn());
    jest.spyOn(permissionManager, 'isRestricted').mockResolvedValue(true);
    const { getByTestId, queryByTestId } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('tasks-delete-action'));
    });

    // Assert
    await waitFor(() => {
      expect(queryByTestId('yes-delete-tasks')).not.toBeInTheDocument();
    });
  });

  it('Should not mark task as complete when restrictions applied', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpGet').mockImplementation(jest.fn());
    jest.spyOn(permissionManager, 'isRestricted').mockResolvedValue(true);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(screen.getByTestId('tasks-mark-task'));
    });

    // Assert
    await waitFor(() => {
      expect(queryByText('Mark Open')).not.toBeInTheDocument();
    });
  });

  it('Should mark task as complete when no restrictions applied', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpGet').mockImplementation(jest.fn());
    jest.spyOn(permissionManagerUtils, 'isTypeRestricted').mockReturnValue(false);
    jest.spyOn(markComplete, 'getMarkTaskProcess').mockResolvedValue(null);
    const { queryByText } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(screen.getByTestId('tasks-mark-task'));
    });

    // Assert
    await waitFor(() => {
      expect(queryByText('Mark Open')).toBeInTheDocument();
    });
  });

  it('Should render Todo Icon for Todo task', async () => {
    // Arrange
    jest.spyOn(taskUtils, 'fetchTasks').mockResolvedValue({
      tasksList: tasks.slice(1, 2) as unknown as ITaskItem[],
      totalTasks: 1
    });
    const { queryByTestId } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('task-todo-icon')).toBeInTheDocument();
    });
  });

  it('Should render Assignment Icon for Appointment task', async () => {
    // Arrange
    const { queryByTestId } = render(
      <Tasks
        tabId={TAB_ID.LeadTasks}
        getData={() => {
          return { coreData: MOCK_ENTITY_DETAILS_CORE_DATA };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('task-appointment-icon')).toBeInTheDocument();
    });
  });
});
