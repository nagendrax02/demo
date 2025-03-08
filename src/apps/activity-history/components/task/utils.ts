import { ITaskItem } from 'src/apps/tasks/tasks.types';
import { IAugmentedAHDetail } from '../../types';

export const convertToTaskItem = (activityTask: IAugmentedAHDetail): ITaskItem => {
  const taskAdditionalDetails = activityTask.AdditionalDetails;

  return {
    ID: activityTask.Id as string,
    Name: taskAdditionalDetails?.UserTaskName as string,
    Description: taskAdditionalDetails?.UserTaskDescription as string,
    TaskType: taskAdditionalDetails?.UserTaskType as string,
    CompletedOnString: activityTask.ActivityDateTime as string,
    CreatedOnString: activityTask.ActivityDateTime as string,
    EntityType: taskAdditionalDetails?.EntityType as string,
    OpportunityTitle: taskAdditionalDetails?.OpportunityTitle as string,
    RelatedSubEntityId: taskAdditionalDetails?.RelatedSubEntityId as string,
    OwnerName: `${taskAdditionalDetails?.FirstName} ${taskAdditionalDetails?.LastName}`,
    CreatedByName: `${taskAdditionalDetails?.FirstName} ${taskAdditionalDetails?.LastName}`,
    OwnerID: taskAdditionalDetails?.UserTaskOwnerId as string,
    EndDateString: taskAdditionalDetails?.UserTaskDueDate as string,
    DateString: activityTask.ActivityDateTime as string,
    Status: Number(taskAdditionalDetails?.UserTaskStatusReason),
    OpenCompletedTasks: activityTask?.IsEditable === 1,
    CreatedBy: taskAdditionalDetails?.UserTaskCreatedBy || '',
    Type: -1,
    Date: '',
    CreatedOn: '',
    Reminder: '',
    Attachment: '',
    EndDate: '',
    Color: '',
    CompletedOn: '',
    ActivityEvent: '',
    OpportunityEvent: taskAdditionalDetails?.OpportunityEvent as string,
    CompletedByName: taskAdditionalDetails?.UserTaskCompletedByName ?? ''
  };
};
