import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import { API_URL, EMAIL_SETTINGS } from '../constants';
import {
  IEmailConfigResponse,
  IEmailSettings,
  IGetContentHtml,
  IGetEmailData,
  IGetSubject,
  IGetToFields,
  IOption,
  IRetrieveEmailData,
  ISendEmailFields
} from '../send-email.types';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { fetchMetaData } from 'common/utils/entity-data-manager/lead/metadata';
import { DataType } from 'common/types/entity/lead';
import { API_ROUTES } from 'common/constants';
import { IAuthenticationConfig, IUserData } from 'common/types';
import { IGroupedOption } from '../../grouped-option-dropdown';
import { getFormattedDateTime } from 'common/utils/date';

const getCachedEmailConfig = (): IEmailConfigResponse | undefined => {
  const response = getItem(StorageKey.EmailConfig) as IEmailConfigResponse | undefined;
  return response;
};

const setCachedEmailConfig = (emailConfig: IEmailConfigResponse): void => {
  try {
    setItem(StorageKey.EmailConfig, emailConfig);
  } catch (err) {
    trackError('Failed to set email config in cache', err);
  }
};

const getCachedAdvancedConfigSettings = (
  settingNames: string[]
): Record<string, boolean> | undefined => {
  const response = getItem(StorageKey.EmailSettings);
  if (response) {
    const settings: Record<string, boolean> = {};
    settingNames.forEach((settingName) => {
      if (typeof response?.[settingName] === 'boolean') {
        settings[settingName] = response?.[settingName] as boolean;
      }
    });
    return settings;
  }

  return undefined;
};

const setCachedAdvancedConfigSettings = (settings: Record<string, boolean>): void => {
  try {
    setItem(StorageKey.EmailSettings, settings);
  } catch (err) {
    trackError('Failed to set email settings in cache', err);
  }
};

const getEmailConfig = async (callerSource: CallerSource): Promise<IEmailConfigResponse> => {
  let response = getCachedEmailConfig();
  if (!response) {
    response = (await httpGet({
      path: API_URL.MODAL_CONFIG,
      module: Module.Marvin,
      callerSource
    })) as IEmailConfigResponse;
    setCachedEmailConfig(response);
  }

  return response;
};

const getAdvancedConfigSettings = async (
  callerSource: CallerSource
): Promise<Record<string, boolean>> => {
  const advancedSettingNames = [
    EMAIL_SETTINGS.REPLY_TO_ENABLED_IN_BULK_EMAIL,
    EMAIL_SETTINGS.REPLY_TO_ENABLED_IN_ONE_TO_TO_EMAIL
  ];

  const cachedSettings = getCachedAdvancedConfigSettings(advancedSettingNames);

  if (cachedSettings && Object.keys(cachedSettings).length === advancedSettingNames.length) {
    return cachedSettings;
  } else {
    const settings = { ...cachedSettings };
    const missingSettings = advancedSettingNames.filter((settingName) => {
      return !Object.hasOwn(settings || {}, settingName);
    });
    const response = await httpPost({
      path: API_URL.SETTING_GET,
      module: Module.Marvin,
      body: missingSettings,
      callerSource
    });

    if (response && typeof response === 'object') {
      missingSettings.forEach((setting) => {
        if (Object.hasOwn(response, setting)) {
          settings[setting] =
            response?.[setting] === 'true' || response?.[setting] === '1' ? true : false;
        }
      });
    }

    setCachedAdvancedConfigSettings(settings);
    return settings;
  }
};

const getEmailDataFromLeads = async (
  callerSource: CallerSource,
  leadTypeInternalName?: string
): Promise<Record<string, IOption[] | Record<string, IOption[]>>> => {
  const emailData: Record<string, IOption[] | Record<string, IOption[]>> = {};
  const response = await fetchMetaData(callerSource, leadTypeInternalName, true);
  if (response) {
    const emailFieldsValues = Object.values(response)
      ?.filter((lead) => lead?.DataType === DataType.Email)
      .map((lead) => {
        return {
          value: lead?.SchemaName,
          label: lead?.DisplayName
        };
      });
    emailData.emailFieldsValues = emailFieldsValues;
    const leadMailMergeValues = Object.values(response)
      ?.map((lead) => {
        if (lead?.CustomObjectMetaData && lead?.CustomObjectMetaData?.Fields?.length) {
          const cfsFields = lead?.CustomObjectMetaData?.Fields.map((cfsLead) => {
            return {
              value: `{Lead:${cfsLead?.CustomObjectSchemaName}-${cfsLead?.SchemaName},}`,
              label: `${lead?.DisplayName} - ${cfsLead?.DisplayName}`
            };
          });
          return cfsFields;
        }
        return {
          value: `{Lead:${lead?.SchemaName},}`,
          label: lead?.DisplayName
        };
      })
      ?.flat();
    leadMailMergeValues.sort((firstValue, secondValue) => {
      return firstValue.label.localeCompare(secondValue.label);
    });
    emailData.mailMergeValues = { lead: leadMailMergeValues } as Record<string, IOption[]>;
  }
  return emailData;
};

const getFromUser = async (
  userId: string,
  callerSource: CallerSource
): Promise<IOption | undefined> => {
  let fromUser: IOption | undefined = undefined;

  const body = {
    SearchText: '',
    Count: 1,
    Ids: userId,
    LookUpName: 'IsEmailSender',
    LookUpValue: '1'
  };
  const userData = (await httpPost({
    path: API_ROUTES.userDropdownOptionsGet,
    module: Module.Marvin,
    body: body,
    callerSource
  })) as IUserData;

  if (userData.Options && userData.Options.length !== 0) {
    fromUser = {
      label: userData.Options[0].label || '',
      value: userData.Options[0].value || ''
    };
  }

  return fromUser;
};

const buildRequestBody = (
  props: IGetEmailData
): Record<string, string | number | boolean | undefined> => {
  const { activity, opportunity, toLead } = props;
  return {
    LeadId: toLead?.[0]?.value,
    ActivityId: activity?.ActivityId || '',
    ActivityType: activity?.ActivityType || 0,
    ActivityEvent: activity?.ActivityEvent || 0,
    IsOpportunityDetailsCall: !!opportunity,
    OpportunityId: opportunity?.ProspectOpportunityId || '',
    OpportunityEventCode: opportunity?.OpportunityEventId || 0
  };
};

const retrieveEmailData = async (
  body: Record<string, string | number | boolean | undefined>,
  callerSource: CallerSource
): Promise<IRetrieveEmailData | undefined> => {
  return (await httpPost({
    path: API_ROUTES.emailRetrievalForEntity,
    module: Module.Marvin,
    body,
    callerSource
  })) as IRetrieveEmailData | undefined;
};

const getEmailData = async (props: IGetEmailData): Promise<IRetrieveEmailData | undefined> => {
  try {
    const { activity, opportunity, toLead, callerSource } = props;

    if ((activity || opportunity) && toLead) {
      const body = buildRequestBody(props);
      const response = await retrieveEmailData(body, callerSource);

      if (response && Object.keys(response)?.length) {
        return response;
      }
    }
  } catch (error) {
    trackError(error);
  }
  return {};
};

const getToFields = (props: IGetToFields): IGroupedOption[] => {
  const { emailData, toLead } = props;
  if (emailData && emailData?.LeadData && toLead?.length) {
    return toLead?.map((lead) => ({
      value: lead.value as string,
      label: `${emailData?.LeadData?.FirstName || emailData.LeadData?.EmailAddress} ${
        emailData?.LeadData?.LastName || ''
      }`,
      group: ''
    }));
  }
  return [];
};

export const getSubject = (props: IGetSubject): string => {
  const { emailData } = props;
  if (emailData && emailData?.EmailData && emailData?.EmailData?.Subject) {
    if (emailData.EmailData.Subject.startsWith('RE:')) return emailData.EmailData.Subject;
    return `RE: ${emailData.EmailData.Subject}`;
  }
  return '';
};

const getFormatDateAndTime = (utcTime: Date): string => {
  const userDetails = getItem(StorageKey.Auth) as IAuthenticationConfig;
  const dateFormat = userDetails?.User?.DateFormat || 'mm/dd/yyy';
  const timeZone = userDetails?.User?.TimeZone;
  const formateDateTime = getFormattedDateTime({
    date: utcTime.toString(),
    dateTimeFormat: `${dateFormat} hh:mm:ss a`,
    timeZone
  });
  return formateDateTime;
};

const getContentHtml = (props: IGetContentHtml): string => {
  const { emailData } = props;
  if (emailData && emailData?.EmailData && emailData?.EmailData?.ContentHTML) {
    let contentHtml = `<p></p><p></p><p></p><p></p><mxreplyseparator><span style="width: 100%; border-top: 1px solid #000000;display: inline-block;">&shy;</span>`;
    if (emailData.EmailData.From)
      contentHtml = `${contentHtml}<strong>From: </strong>${emailData.EmailData.From}<br />`;
    if (emailData.EmailData.Subject)
      contentHtml = `${contentHtml}<strong>Subject: </strong>${emailData.EmailData.Subject}<br />`;
    if (emailData.EmailData.SentOn)
      contentHtml = `${contentHtml}<strong>Sent On: </strong>${getFormatDateAndTime(
        emailData.EmailData.SentOn
      )}<br /><br />`;
    return `${contentHtml} ${emailData.EmailData.ContentHTML}</mxreplyseparator>`;
  }
  return '';
};

const getRestrictMobileUsers = (settings?: IEmailSettings): boolean => {
  return settings?.RestrictAllMobileUsersAsEmailSenders === '1' ||
    settings?.RestrictAllMobileUsersAsEmailSenders === true ||
    (typeof settings?.RestrictAllMobileUsersAsEmailSenders === 'string' &&
      settings?.RestrictAllMobileUsersAsEmailSenders?.toLowerCase() === 'true')
    ? true
    : false;
};

const getAdditionalUserData = (
  fields: ISendEmailFields,
  settings?: IEmailSettings
): Record<string, string | boolean> => {
  let additionalUserData: Record<string, string | boolean> = {
    RestrictMobileUsers: getRestrictMobileUsers(settings),
    ExcludeSystemUser: false,
    ExcludeAgencyUser: true
  };
  if (settings && settings.ChooseSpecificEmailSenders) {
    additionalUserData = {
      LookUpName: 'IsEmailSender',
      LookUpValue: '1',
      ...additionalUserData
    };
  }
  if (fields?.to && fields?.to?.length === 1) {
    additionalUserData = {
      ...additionalUserData,
      AddLeadOwner: true
    };
  }
  return additionalUserData;
};

export {
  getEmailConfig,
  getAdvancedConfigSettings,
  getEmailDataFromLeads,
  getFromUser,
  getEmailData,
  getToFields,
  getContentHtml,
  getAdditionalUserData
};
