import { parseAdditionalDetails, getAugmentedAHDetails } from '../../utils';
import { IActivityHistoryDetail } from 'apps/activity-history/types';
import { ACTIVITY, ACTIVITY_TYPE } from '../../constants';
import { EntityType } from 'src/common/types';

describe('parseAdditionalDetails', () => {
  it('Should return null for undefined additionalDetails', () => {
    // Act
    const result = parseAdditionalDetails();

    // Assert
    expect(result).toBeNull();
  });

  it('Should parse valid JSON additionalDetails', () => {
    // Arrange
    const additionalDetails = '{"key": "value"}';

    // Act
    const result = parseAdditionalDetails(additionalDetails);

    // Assert
    expect(result).toEqual({ key: 'value' });
  });

  it('Should return null for invalid JSON additionalDetails', () => {
    // Arrange

    const additionalDetails = 'invalid json';

    // Act
    const result = parseAdditionalDetails(additionalDetails);

    // Assert
    expect(result).toBeNull();
  });
});

describe('getAugmentedAHDetails', () => {
  // Arrange
  const commonData = {
    ActivityEvent: -1,
    ActivityType: 1,
    ActivityDateTime: '',
    ActivityName: 'ActivityName',
    AdditionalDetails: '',
    CanDeleteActivity: false,
    Id: 'Id',
    IsEditable: 0,
    LeadId: '',
    SystemDate: ''
  };

  const mockActivityHistoryDetails: IActivityHistoryDetail[] = [
    {
      ...commonData,
      ActivityEvent: ACTIVITY.LEAD_ASSIGNED
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.CHANGE_LOG
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.LOGGED_INTO_PORTAL,
      ActivityType: ACTIVITY_TYPE.PORTAL_ACTIVITY
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.DO_NOT_TRACK_REQUEST,
      ActivityType: ACTIVITY_TYPE.GDPR_ACTIVITY
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.DELETE_LOG
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.OPPORTUNITY_ASSIGNED
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.TASK
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.NOTES
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.LEAD_CAPTURE
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.DUPLICATE_OPP_DETECTED
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.PUBLISHER_TRACKING
    },
    {
      ...commonData,
      ActivityEvent: ACTIVITY.PRIVACY_COOKIE_CONSENT
    },
    {
      ...commonData,
      ActivityType: ACTIVITY_TYPE.EMAIL_SENT
    },
    {
      ...commonData,
      ActivityType: ACTIVITY_TYPE.WEB_ACTIVITY
    },
    {
      ...commonData,
      ActivityType: ACTIVITY_TYPE.PHONE_ACTIVITY
    },
    {
      ...commonData,
      ActivityType: ACTIVITY_TYPE.DYNAMIC_FORM
    },
    {
      ...commonData,
      ActivityType: ACTIVITY_TYPE.CUSTOM_ACTIVITY
    },
    {
      ...commonData,
      ActivityType: -1
    }
  ];

  it('Should return augmented details for valid activity events', async () => {
    // Act
    const result = await getAugmentedAHDetails(mockActivityHistoryDetails, EntityType.Lead);

    // Assert
    expect(result).toHaveLength(18);
  });
});
