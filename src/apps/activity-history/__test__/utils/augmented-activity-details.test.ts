import { EntityType } from 'common/types';
import { ActivityRenderType } from '../../types';
import getAugmentedCustomDetails from '../../utils/augmented-activity-details/custom';
import getAugmentedDeleteLogsDetails from '../../utils/augmented-activity-details/delete-logs';
import getAugmentedDynamicFromDetails from '../../utils/augmented-activity-details/dynamic-form';
import getAugmentedEmailDetails from '../../utils/augmented-activity-details/email';
import getAugmentedLeadAuditDetails from '../../utils/augmented-activity-details/lead-audit';
import getAugmentedLeadCaptureDetails from '../../utils/augmented-activity-details/lead-capture';
import getAugmentedNotesDetails from '../../utils/augmented-activity-details/notes';
import getAugmentedOpportunityDetails from '../../utils/augmented-activity-details/opportunity';
import getAugmentedOpportunityAuditDetails from '../../utils/augmented-activity-details/opportunity-audit';
import getAugmentedPhoneDetails from '../../utils/augmented-activity-details/phone';
import getAugmentedPortalDetails from '../../utils/augmented-activity-details/portal';
import getAugmentedPrivacyDetails from '../../utils/augmented-activity-details/privacy';
import getAugmentedTaskDetails from '../../utils/augmented-activity-details/task';
import getAugmentedWebDetails from '../../utils/augmented-activity-details/web';

// Arrange
const input = {
  AdditionalDetails: '{"key": "value", "number": 42}',
  ActivityDateTime: '',
  ActivityEvent: 1,
  ActivityName: 'ActivityName',
  ActivityType: 2,
  CanDeleteActivity: false,
  Id: '12',
  IsEditable: 0,
  LeadId: 'LeadId',
  SystemDate: ''
};

describe('getAugmentedCustomDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Custom', () => {
    // Act
    const result = getAugmentedCustomDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Custom
    });
  });
});

describe('getAugmentedDeleteLogsDetails', () => {
  it('Should augment additional details and set ActivityRenderType to DeleteLogs', () => {
    // Act
    const result = getAugmentedDeleteLogsDetails(input);

    // Assert
    expect(result).toEqual({
      Id: '12',
      ActivityName: 'ActivityName',
      ActivityDateTime: '',
      ActivityEvent: 1,
      ActivityType: 2,
      AdditionalDetails: {
        ActivityScore: undefined,
        CreatedBy: undefined,
        CreatedByName: undefined,
        ProspectActivityID: undefined,
        RelatedActivityEvent: undefined,
        RelatedActivityId: undefined,
        RelatedActivityName: undefined
      },
      ActivityRenderType: ActivityRenderType.DeleteLogs
    });
  });
});

describe('getAugmentedDynamicFromDetails', () => {
  it('Should augment additional details and set ActivityRenderType to DynamicForm', () => {
    // Act
    const result = getAugmentedDynamicFromDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.DynamicForm
    });
  });
});

describe('getAugmentedEmailDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Email', () => {
    // Act
    const result = getAugmentedEmailDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Email
    });
  });
});

describe('getAugmentedLeadAuditDetails', () => {
  it('Should augment additional details and set ActivityRenderType to LeadAudit', () => {
    // Act
    const result = getAugmentedLeadAuditDetails(input, EntityType.Lead);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.LeadAudit,
      AuditData: {
        CompanyName: undefined,
        PerformerName: undefined,
        OldValue: undefined,
        NewValue: undefined,
        ChangedBy: undefined
      }
    });
  });
});

describe('getAugmentedLeadCaptureDetails', () => {
  it('Should augment additional details and set ActivityRenderType to LeadCapture', () => {
    // Act
    const result = getAugmentedLeadCaptureDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.LeadCapture
    });
  });
});

describe('getAugmentedNotesDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Note', () => {
    // Act
    const result = getAugmentedNotesDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Note
    });
  });
});

describe('getAugmentedOpportunityDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Opportunity', () => {
    // Act
    const result = getAugmentedOpportunityDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Opportunity
    });
  });
});

describe('getAugmentedOpportunityAuditDetails', () => {
  it('Should augment additional details and set ActivityRenderType to OpportunityAudit', () => {
    // Act
    const result = getAugmentedOpportunityAuditDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.OpportunityAudit,
      AuditData: {
        OldValue: undefined,
        NewValue: undefined,
        ChangedBy: undefined
      }
    });
  });
});

describe('getAugmentedPhoneDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Phone', () => {
    // Act
    const result = getAugmentedPhoneDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Phone
    });
  });
});

describe('getAugmentedPortalDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Portal', () => {
    // Act
    const result = getAugmentedPortalDetails(input);

    // Assert
    expect(result).toEqual({
      Id: input.Id,
      ActivityEvent: input.ActivityEvent,
      ActivityType: input.ActivityType,
      ActivityDateTime: input.ActivityDateTime,
      ActivityRenderType: ActivityRenderType.Portal,
      AdditionalDetails: {
        ActivityScore: undefined,
        CreatedBy: undefined,
        CreatedByName: undefined,
        PortalDisplayName: undefined,
        PortalUrl: undefined
      }
    });
  });
});

describe('getAugmentedPrivacyDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Privacy', () => {
    // Act
    const result = getAugmentedPrivacyDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Privacy
    });
  });
});

describe('getAugmentedTaskDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Task', () => {
    // Act
    const result = getAugmentedTaskDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Task
    });
  });
});

describe('getAugmentedWebDetails', () => {
  it('Should augment additional details and set ActivityRenderType to Web', () => {
    // Act
    const result = getAugmentedWebDetails(input);

    // Assert
    expect(result).toEqual({
      ...input,
      AdditionalDetails: { key: 'value', number: 42 },
      ActivityRenderType: ActivityRenderType.Web
    });
  });
});
