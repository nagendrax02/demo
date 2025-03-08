import { CallerSource } from 'src/common/utils/rest-client';
import { EventCode } from '../../../activity-table.types';
import {
  getLeadCaptureResponse,
  getDoNotTrackRequestResponse,
  getChangeLogResponse,
  getPrivacyDetailsResponse,
  getPhoneActivityResponse,
  getEmailOptedInAndOptedOutResponse,
  getOpportunityCaptureResponse
} from '../../config/data-fetcher';

jest.mock('common/utils/rest-client', () => ({
  __esModule: true,
  httpGet: jest.fn(),
  httpPost: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

const changeLogField = {
  DisplayName: 'fieldName',
  OldValue: null,
  NewValue: null,
  DataType: 'dataType',
  ShowInForm: false,
  IsMandatory: false,
  SchemaName: 'schemaName',
  InternalName: null
};

const field = {
  DataType: 'dataType',
  DisplayName: 'displayName',
  SchemaName: 'schemaName',
  Value: 'Value',
  ShowInForm: false,
  IsMandatory: false
};

jest.mock('../../process-user-fields', () => ({
  processUserFields: jest.fn(() => [field])
}));

jest.mock('../../../opportunity-fields-renderer', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../../opportunity-fields-renderer/utils.ts', () => ({
  augmentOpportunityFormData: jest.fn()
}));

const activityDetails = {
  ActivityCode: 1,
  DisplayName: 'name',
  ActivityEvent: 1,
  EntityType: 0,
  Fields: [] as any,
  RelatedActivityId: null,
  RestrictOperations: false,
  ActivityEvent_Note: ''
};

describe('getLeadCaptureResponse', () => {
  it('Should return empty array when ActivityEvent_Note empty', async () => {
    //  Act
    const result = await getLeadCaptureResponse({
      id: 'id',
      additionalDetails: { ActivityEvent_Note: '' },
      callerSource: CallerSource.ActivityHistoryLeadCapture
    });

    // Assert
    expect(result).toEqual([]);
  });

  it('Should return eventNoteDetails when ActivityEvent_Note is present', async () => {
    const note = '{keyvalueinfo}{key1{=}value1{next}key2{=}value2';
    const result = await getLeadCaptureResponse({
      id: 'id',
      additionalDetails: { ActivityEvent_Note: note },
      callerSource: CallerSource.ActivityHistoryLeadCapture
    });

    expect(result).toEqual([
      {
        DisplayName: 'key1',
        Value: 'value1',
        DataType: 'String',
        ShowInForm: true
      },
      {
        DisplayName: 'key2',
        Value: 'value2',
        DataType: 'String',
        ShowInForm: true
      }
    ]);
  });
});

describe('getDoNotTrackRequestResponse', () => {
  const expectedWithoutAdditionalDetails = [
    {
      DisplayName: 'IP Address',
      Value: '-',
      DataType: 'String',
      SchemaName: 'IPAddress',
      ShowInForm: 1
    },
    {
      DisplayName: 'User Agent',
      Value: '-',
      DataType: 'String',
      SchemaName: 'UserAgent',
      ShowInForm: 1
    },
    {
      DisplayName: 'Origin',
      Value: '-',
      DataType: 'String',
      SchemaName: 'Origin',
      ShowInForm: 1
    },
    {
      DisplayName: 'Page URL',
      Value: '-',
      DataType: 'String',
      SchemaName: 'PageURL',
      ShowInForm: 1
    },
    {
      DisplayName: 'Do Not Track Request',
      Value: 'No',
      DataType: 'String',
      SchemaName: 'DoNotTrackRequest',
      ShowInForm: 1
    },
    {
      DisplayName: 'Note',
      Value: '-',
      DataType: 'String',
      SchemaName: 'Note',
      ShowInForm: 1
    }
  ];

  it('Should return expectedWithoutAdditionalDetails when additionalDetails undefined', async () => {
    //  Act
    const result = await getDoNotTrackRequestResponse({
      id: 'id',
      additionalDetails: { ActivityEvent_Note: '' },
      callerSource: CallerSource.ActivityHistoryDoNotTrackRequest
    });

    // Assert
    expect(result).toEqual(expectedWithoutAdditionalDetails);
  });

  it('Should return expectedWithAdditionalDetails when additionalDetails not undefined', async () => {
    // Arrange
    const additionalDetails = {
      IPAddress: '1.2.3.4.5',
      WebUserAgent: 'chrome',
      MXCustom1: '2',
      Activity_Web_PageURL: 'https://www.google.com',
      MXCustom2: '1',
      ActivityEvent_Note: '{keyvalueinfo}{key1{=}value1{next}key2{=}value2'
    };

    // Act
    const result = await getDoNotTrackRequestResponse({
      id: 'id',
      additionalDetails,
      callerSource: CallerSource.ActivityHistoryDoNotTrackRequest
    });

    const values = Object.values(additionalDetails);
    const expectedWithAdditionalDetails = expectedWithoutAdditionalDetails.map((item, index) => {
      return {
        ...item,
        Value: values[index] === '1' ? 'Yes' : values[index]
      };
    });

    // Assert
    expect(result).toEqual(expectedWithAdditionalDetails);
  });
});

describe('getChangeLogResponse', () => {
  it('Should fetch changeLog and return Fields', async () => {
    activityDetails.Fields = [changeLogField];
    // Arrange
    jest
      .spyOn(require('common/utils/rest-client'), 'httpPost')
      .mockResolvedValueOnce(activityDetails);

    //  Act
    const result = await getChangeLogResponse({
      id: 'id',
      eventCode: 0,
      callerSource: CallerSource.ActivityHistoryChangeLog
    });

    // Assert
    expect(result).toEqual(activityDetails.Fields);
  });
});

describe('getPrivacyDetailsResponse', () => {
  // Arrange
  const commonDetails = [
    {
      DisplayName: 'IP Address',
      Value: '1.2.3.4',
      ShowInForm: true,
      DataType: 'String'
    },
    {
      DisplayName: 'User Agent',
      Value: 'chrome',
      ShowInForm: true,
      DataType: 'String'
    }
  ];

  const additionalDetails = {
    ActivityEvent_Note: 'test',
    IPAddress: '1.2.3.4',
    WebUserAgent: 'chrome',
    Activity_Web_PageURL: 'https://www.google.com'
  };

  it('Should fetch privacy details and return fields with dataProtectionRequest when eventCode is EventCode.DataProtectionRequest', async () => {
    // Arrange
    activityDetails.Fields = [field];
    jest
      .spyOn(require('common/utils/rest-client'), 'httpGet')
      .mockResolvedValueOnce(activityDetails);

    const dataProtectionRequest = {
      DisplayName: 'Request Details',
      Value: 'test',
      ShowInForm: true,
      DataType: 'String'
    };

    // Act
    const result = await getPrivacyDetailsResponse({
      id: 'id',
      eventCode: EventCode.DataProtectionRequest,
      additionalDetails,
      callerSource: CallerSource.ActivityHistoryPrivacyActivity
    });

    // Assert
    expect(result).toEqual([field, ...commonDetails, dataProtectionRequest]);
  });

  it('Should fetch privacy details and return fields with PrivacyCookieContent when eventCode is EventCode.PrivacyCookieContent', async () => {
    // Arrange
    activityDetails.Fields = [field];
    jest
      .spyOn(require('common/utils/rest-client'), 'httpGet')
      .mockResolvedValueOnce(activityDetails);

    const cookieConsent = {
      DisplayName: 'Page URL',
      Value: 'https://www.google.com',
      ShowInForm: true,
      DataType: 'String'
    };

    // Act
    const result = await getPrivacyDetailsResponse({
      id: 'id',
      eventCode: EventCode.PrivacyCookieContent,
      additionalDetails,
      callerSource: CallerSource.ActivityHistoryPrivacyActivity
    });

    // Assert
    expect(result).toEqual([field, ...commonDetails, cookieConsent]);
  });

  it('Should return empty array when EventCode is not PrivacyCookieContent or DataProtectionRequest', async () => {
    // Act
    const result = await getPrivacyDetailsResponse({
      id: 'id',
      eventCode: 0,
      callerSource: CallerSource.ActivityHistoryPrivacyActivity
    });

    // Assert
    expect(result).toEqual([]);
  });
});

describe('getPhoneActivityResponse', () => {
  it('Should fetch phone details and return fields with callNotes when ActivityEvent_Note is present', async () => {
    // Arrange
    activityDetails.Fields = [field];
    jest
      .spyOn(require('common/utils/rest-client'), 'httpGet')
      .mockResolvedValueOnce(activityDetails);

    const callNotes = {
      DataType: 'String',
      DisplayName: 'Call Notes',
      Value: 'value1',
      ShowInForm: true
    };

    // Act
    const result = await getPhoneActivityResponse({
      id: 'id',
      additionalDetails: {
        ActivityEvent_Note: 'EventNote{=}value1'
      },
      callerSource: CallerSource.ActivityHistoryPhoneActivity
    });

    // Assert
    expect(result).toEqual([field, callNotes]);
  });

  it('Should fetch phone details and return fields without callNotes when ActivityEvent_Note is undefined', async () => {
    // Arrange
    activityDetails.Fields = [field];
    jest
      .spyOn(require('common/utils/rest-client'), 'httpGet')
      .mockResolvedValueOnce(activityDetails);

    // Act
    const result = await getPhoneActivityResponse({
      id: 'id',
      callerSource: CallerSource.ActivityHistoryPhoneActivity
    });

    // Assert
    expect(result).toEqual([field]);
  });
});

describe('getEmailOptedInAndOptedOutResponse', () => {
  // Arrange
  const getCommonDetails = (isOpted: boolean, additionalDetails?: Record<string, string>) => [
    {
      DisplayName: 'IP Address',
      Value: additionalDetails?.IPAddress ? additionalDetails.IPAddress : '-',
      DataType: 'String',
      ShowInForm: true
    },
    {
      DisplayName: 'User Agent',
      Value: additionalDetails?.WebUserAgent ? additionalDetails.WebUserAgent : '-',
      DataType: 'String',
      ShowInForm: true
    },
    {
      DisplayName: isOpted ? 'Opt in Status' : 'Opt out Status',
      Value: isOpted ? 'Opted In' : 'Opted Out',
      DataType: 'String',
      ShowInForm: true
    }
  ];

  const getComment = (additionalDetails?: Record<string, string>) => ({
    DisplayName: 'Comments',
    Value: additionalDetails?.NotableEventDescription
      ? additionalDetails.NotableEventDescription
      : '-',
    DataType: 'String',
    ShowInForm: true
  });

  it('Should fetch emailOptedInAndOptedOut details and return fields with Value "-" when additionalDetails undefined', async () => {
    // Arrange
    activityDetails.Fields = [field];
    jest
      .spyOn(require('common/utils/rest-client'), 'httpGet')
      .mockResolvedValueOnce(activityDetails);

    // Act
    const result = await getEmailOptedInAndOptedOutResponse({
      id: 'id',
      callerSource: CallerSource.ActivityHistoryEmailOpt
    });

    // Assert
    expect(result).toEqual([...getCommonDetails(false), field, getComment()]);
  });

  it('Should fetch emailOptedInAndOptedOut details and return  fields with Value when additionalDetails present', async () => {
    // Arrange
    activityDetails.Fields = [field];
    jest
      .spyOn(require('common/utils/rest-client'), 'httpGet')
      .mockResolvedValueOnce(activityDetails);

    const additionalDetails = {
      ActivityScore: '3',
      IPAddress: '1.2.3.4',
      WebUserAgent: 'chrome',
      NotableEventDescription: 'test'
    };

    // Act
    const result = await getEmailOptedInAndOptedOutResponse({
      id: 'id',
      additionalDetails,
      callerSource: CallerSource.ActivityHistoryEmailOpt
    });

    // Assert
    expect(result).toEqual([
      ...getCommonDetails(true, additionalDetails),
      field,
      getComment(additionalDetails)
    ]);
  });
});

describe('getOpportunityCaptureResponse', () => {
  it('Should return empty array when additionalDetails and leadRepresentationName are undefined', async () => {
    // Arrange
    const dataFetcherProps = {
      id: 'id',
      additionalDetails: undefined,
      leadRepresentationName: undefined,
      callerSource: CallerSource.ActivityHistoryOpportunityActivity
    };

    // Act
    const result = await getOpportunityCaptureResponse(dataFetcherProps);

    // Assert
    expect(result).toEqual([]);
  });

  it('Should return fieldsData when additionalDetails and leadRepresentationName are defined', async () => {
    // Arrange
    const dataFetcherProps = {
      id: 'id',
      additionalDetails: { ActivityEvent_Note: 'note' },
      leadRepresentationName: {
        SingularName: 'Lead',
        PluralName: ''
      },
      callerSource: CallerSource.ActivityHistoryOpportunityActivity
    };
    const mockFieldsData = [{ DisplayName: 'key1', Value: 'value1' }];
    jest
      .spyOn(require('../../../opportunity-fields-renderer/utils'), 'augmentOpportunityFormData')
      .mockResolvedValueOnce(mockFieldsData);
    jest
      .spyOn(require('../../../opportunity-fields-renderer'), 'default')
      .mockReturnValue(mockFieldsData);

    // Act
    const result = await getOpportunityCaptureResponse(dataFetcherProps);

    // Assert
    expect(result).toEqual(mockFieldsData);
  });
});
