import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import {
  noteParser,
  customActivityParser,
  convertSecondsToMinute
} from 'common/utils/helpers/activity-history';
import { augmentOpportunityFormData } from '../../opportunity-fields-renderer/utils';
import {
  EventCode,
  IField,
  IChangeLog,
  IAdditionalDetails,
  IDataFetcherProps
} from '../../activity-table.types';
import { processUserFields } from '../process-user-fields';
import * as constants from '../../constants';
import { convertToISO } from '@lsq/nextgen-preact/date/utils';
import { handleActivityTableForAccount, isValidJson } from 'common/utils/helpers/helpers';

export interface IActivityDetails {
  ActivityCode: number;
  DisplayName: string;
  ActivityEvent: number;
  EntityType: number;
  Fields: IField[] | IChangeLog[];
  RelatedActivityId: number | null;
  RestrictOperations: boolean;
  ActivityEvent_Note: string;
}

export const fetchChangeLog = async ({
  id,
  additionalDetails,
  eventCode,
  callerSource
}: {
  id: string;
  callerSource: CallerSource;
  eventCode?: number;
  additionalDetails?: IAdditionalDetails;
}): Promise<IActivityDetails | null> => {
  const body = {
    Id: id,
    ActivityEvent: String(eventCode),
    OldData: additionalDetails?.OldData?.replaceAll('null', "''"),
    NewData: additionalDetails?.NewData?.replaceAll('null', "''"),
    ProspectActivityAuditId: additionalDetails?.ProspectActivityAuditId ?? id
  };

  try {
    const path = additionalDetails?.isAccountActivityHistoryTab
      ? API_ROUTES.accountActivityChangeLog
      : API_ROUTES.activityChangeLog;

    const response = (await httpPost({
      path: path,
      module: Module.Marvin,
      body,
      callerSource
    })) as IActivityDetails;
    return response;
  } catch (error) {
    trackError('Error fetching activity details:', error);
    throw error;
  }
};

export const fetchActivityDetails = async (
  id: string,
  callerSource: CallerSource,
  additionalDetails?: IAdditionalDetails,
  eventCode?: number
): Promise<IActivityDetails | null> => {
  console.log('👉🏼👉🏼👉🏼 ===>>>> ~ eventCode:', eventCode);
  try {
    const path = additionalDetails?.isAccountActivityHistoryTab
      ? `${API_ROUTES.accountActivityDetails}?activityId=${id}`
      : `${API_ROUTES.activityDetails}?id=${id}`;
    const response = (await httpGet({
      path: path,
      module: Module.Marvin,
      callerSource
    })) as IActivityDetails;
    return response;
  } catch (error) {
    trackError('Error fetching activity details:', error);
    throw error;
  }
};

export const getLeadCaptureResponse = async ({ additionalDetails }: IDataFetcherProps) => {
  const eventNote = noteParser(additionalDetails?.ActivityEvent_Note || '');
  const eventNoteDetails: {
    DisplayName: string;
    Value: string;
    DataType: string;
    ShowInForm: boolean;
  }[] = [];

  if (eventNote) {
    Object.keys(eventNote).forEach((item) => {
      eventNoteDetails.push({
        DisplayName: item,
        Value: eventNote[item],
        DataType: 'String',
        ShowInForm: true
      });
    });
  }
  return eventNoteDetails;
};

export const getDoNotTrackRequestResponse = async ({ additionalDetails }: IDataFetcherProps) => {
  return [
    {
      DisplayName: 'IP Address',
      Value: additionalDetails?.IPAddress ? additionalDetails.IPAddress : '-',
      DataType: 'String',
      SchemaName: 'IPAddress',
      ShowInForm: 1
    },
    {
      DisplayName: 'User Agent',
      Value: additionalDetails?.WebUserAgent ? additionalDetails.WebUserAgent : '-',
      DataType: 'String',
      SchemaName: 'UserAgent',
      ShowInForm: 1
    },
    {
      DisplayName: 'Origin',
      Value: additionalDetails?.MXCustom1 ? additionalDetails.MXCustom1 : '-',
      DataType: 'String',
      SchemaName: 'Origin',
      ShowInForm: 1
    },
    {
      DisplayName: 'Page URL',
      Value: additionalDetails?.Activity_Web_PageURL ? additionalDetails.Activity_Web_PageURL : '-',
      DataType: 'String',
      SchemaName: 'PageURL',
      ShowInForm: 1
    },
    {
      DisplayName: 'Do Not Track Request',
      Value: additionalDetails?.MXCustom2 === '1' ? 'Yes' : 'No',
      DataType: 'String',
      SchemaName: 'DoNotTrackRequest',
      ShowInForm: 1
    },
    {
      DisplayName: 'Note',
      Value: additionalDetails?.ActivityEvent_Note ? additionalDetails.ActivityEvent_Note : '-',
      DataType: 'String',
      SchemaName: 'Note',
      ShowInForm: 1
    }
  ];
};

const convertToISOSchemaName = {
  ModifiedOn: 'ModifiedOn',
  CreatedOn: 'CreatedOn',
  CancelledOn: 'CancelledOn'
};

export const getActivityDetailsResponseForAccount = async ({
  id,
  eventCode,
  additionalDetails,
  callerSource
}: IDataFetcherProps): Promise<IField[] | null> => {
  let response = await fetchActivityDetails(id, callerSource, additionalDetails, eventCode);
  if (eventCode && additionalDetails?.isAccountActivityHistoryTab && response) {
    response.Fields = await handleActivityTableForAccount(eventCode, response, callerSource);
  }

  let fields = response?.Fields as IField[] | null;
  if (fields?.length) {
    fields = fields?.map((field) => {
      if (convertToISOSchemaName?.[field?.SchemaName]) {
        return {
          ...field,
          Value: convertToISO(field?.Value)
        };
      }
      return field;
    });
  }

  if (additionalDetails && eventCode === EventCode.SalesActivity) {
    const parsedCustomActivity = customActivityParser(additionalDetails.NotableEventDescription);
    const currency = {
      DisplayName: 'Currency',
      Value: parsedCustomActivity?.Currency || '',
      DataType: 'String',
      SchemaName: 'Currency',
      ShowInForm: true,
      IsMandatory: true
    };
    if (currency?.Value && fields?.length) {
      return [currency, ...fields];
    }
    return fields;
  }

  if (fields?.length) {
    fields = processUserFields(fields);
  }

  return fields;
};

export const getActivityDetailsResponse = async ({
  id,
  eventCode,
  additionalDetails,
  callerSource,
  isAccountActivityHistoryTab
}: IDataFetcherProps): Promise<IField[] | null> => {
  if (isAccountActivityHistoryTab) {
    return getActivityDetailsResponseForAccount({
      id,
      eventCode,
      additionalDetails,
      callerSource
    });
  }

  let response = await fetchActivityDetails(id, callerSource, additionalDetails, eventCode);
  // check it out later, commented due to impact on opp. activity history table
  // if (eventCode && additionalDetails?.isAccountActivityHistoryTab && response) {
  //   response.Fields = await handleActivityTableForAccount(eventCode, response, callerSource);
  // }

  let fields = response?.Fields as IField[] | null;
  if (fields?.length) {
    fields = fields?.map((field) => {
      if (convertToISOSchemaName?.[field?.SchemaName]) {
        return {
          ...field,
          Value: convertToISO(field?.Value)
        };
      }
      return field;
    });
  }

  if (additionalDetails && eventCode === EventCode.SalesActivity) {
    const parsedCustomActivity = customActivityParser(additionalDetails.NotableEventDescription);
    const currency = {
      DisplayName: 'Currency',
      Value: parsedCustomActivity?.Currency || '',
      DataType: 'String',
      SchemaName: 'Currency',
      ShowInForm: true,
      IsMandatory: true
    };
    if (currency?.Value && fields?.length) {
      return [currency, ...fields];
    }
    return fields;
  }

  if (fields?.length) {
    fields = processUserFields(fields);
  }

  return fields;
};

export const getChangeLogResponse = async ({
  id,
  eventCode,
  additionalDetails,
  callerSource
}: IDataFetcherProps) => {
  const response = await fetchChangeLog({ id, eventCode, additionalDetails, callerSource });
  return response?.Fields as IChangeLog[];
};

export const getPrivacyDetailsResponse = async ({
  id,
  eventCode,
  additionalDetails,
  callerSource
}: IDataFetcherProps) => {
  const response = await fetchActivityDetails(id, callerSource);

  let fields = response?.Fields as IField[] | null;

  if (fields?.length) {
    fields = processUserFields(fields);
  }
  const commonDetails = [
    {
      DisplayName: 'IP Address',
      Value: additionalDetails?.IPAddress,
      ShowInForm: true,
      DataType: 'String'
    },
    {
      DisplayName: 'User Agent',
      Value: additionalDetails?.WebUserAgent,
      ShowInForm: true,
      DataType: 'String'
    }
  ];

  const cookieConsent = [
    ...commonDetails,
    {
      DisplayName: 'Page URL',
      Value: additionalDetails?.Activity_Web_PageURL,
      ShowInForm: true,
      DataType: 'String'
    }
  ];

  const dataProtectionRequest = [
    ...commonDetails,
    {
      DisplayName: 'Request Details',
      Value: additionalDetails?.ActivityEvent_Note,
      ShowInForm: true,
      DataType: 'String'
    }
  ];

  if (fields && eventCode === EventCode.DataProtectionRequest) {
    return [...fields, ...dataProtectionRequest];
  }

  if (eventCode === EventCode.PrivacyCookieContent) {
    fields =
      fields?.map((item) => {
        if (item.DisplayName === constants.DO_NOT_TRACK) {
          return {
            ...item,
            Value: item.Value === '0' ? 'No' : 'Yes'
          };
        }
        return item;
      }) || null;
    if (fields?.length) {
      return [...fields, ...cookieConsent];
    }
  }
  return [];
};

export const getPhoneActivityResponse = async ({
  id,
  additionalDetails,
  callerSource
}: IDataFetcherProps) => {
  const response = await fetchActivityDetails(id, callerSource);
  const ActivityEventNote = customActivityParser(additionalDetails?.ActivityEvent_Note || '');
  const callNotes = {
    DataType: 'String',
    DisplayName: 'Call Notes',
    Value: ActivityEventNote?.EventNote || '',
    ShowInForm: true
  };

  let fields = response?.Fields as IField[] | null;

  if (fields?.length) {
    const duration = convertSecondsToMinute(Number(ActivityEventNote?.Duration));
    fields = fields?.map((field: IField) => {
      if (field.DisplayName === 'Call Duration') {
        return { ...field, Value: duration, DataType: 'String' };
      }
      return field;
    });
  }

  if (fields?.length && callNotes?.Value) {
    fields = processUserFields(fields);
    return [...fields, callNotes];
  }
  return fields;
};

export const getEmailOptedInAndOptedOutResponse = async ({
  id,
  additionalDetails,
  callerSource
}: IDataFetcherProps) => {
  let response: IActivityDetails | null = await fetchActivityDetails(id, callerSource);

  const isOpted = additionalDetails?.ActivityScore && Number(additionalDetails?.ActivityScore) > 1;

  const commonDetails = [
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

  const comment = {
    DisplayName: 'Comments',
    Value: additionalDetails?.NotableEventDescription
      ? additionalDetails.NotableEventDescription
      : '-',
    DataType: 'String',
    ShowInForm: true
  };

  let fields = response && (response.Fields as IField[]);
  if (fields?.length) {
    fields = processUserFields(fields);
    return [...commonDetails, ...fields, comment];
  }
  return fields;
};

export const getOpportunityCaptureResponse = async ({
  additionalDetails,
  leadRepresentationName,
  id
}: IDataFetcherProps) => {
  let activityEventNote = additionalDetails && additionalDetails.ActivityEvent_Note;
  if (!activityEventNote || !isValidJson(activityEventNote)) {
    const activityDetailsResponse = await getActivityDetailsResponse({
      id,
      callerSource: CallerSource.ActivityHistory
    });
    activityEventNote = activityDetailsResponse?.find(
      (field) => field?.SchemaName === 'ActivityEvent_Note'
    )?.Value;
  }

  const formData = augmentOpportunityFormData(activityEventNote || '');
  const opportunityFieldsRenderer = await import('../../opportunity-fields-renderer');

  const fieldsData =
    (formData && opportunityFieldsRenderer.default(formData, leadRepresentationName)) || [];

  return fieldsData;
};

export const getPaymentDetailsResponse = async ({
  id,
  eventCode,
  additionalDetails,
  callerSource
}: IDataFetcherProps) => {
  const response = await fetchActivityDetails(id, callerSource);

  let fields = response?.Fields as IField[] | null;

  if (fields?.length) {
    fields = processUserFields(fields);

    return fields;
  }

  return [];
};
