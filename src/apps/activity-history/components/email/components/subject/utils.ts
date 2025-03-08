/* istanbul ignore file */
import { trackError } from 'common/utils/experience/utils/track-error';
import { ICcBccData, IReplyToData } from './subject.type';
import { safeParseJson } from 'common/utils/helpers';

const getSubjectExist = (activityEventNote: string | undefined): boolean => {
  /* istanbul ignore next */
  if (activityEventNote?.includes('Subject{=}')) {
    return true;
  }
  return false;
};

const getBodyAndSubject = (activityEventNote: string): string[] => {
  /* istanbul ignore next */
  if (activityEventNote) {
    let start = activityEventNote.indexOf(`Subject{=}`);
    let end = activityEventNote.indexOf('{next}');
    const subject = activityEventNote.slice(start + 10, end);
    start = activityEventNote.indexOf('Body{=}');
    end = activityEventNote.indexOf('{next}', end + 5);
    const body = activityEventNote.slice(start + 7, end);
    return [subject, body];
  }
  return ['', ''];
};

export const getOptionData = (
  dataString: string
):
  | {
      Name: string;
      Email: string;
    }
  | undefined => {
  /* istanbul ignore next */
  try {
    const parts = dataString.split('<');
    if (parts.length === 2) {
      const name = parts[0].trim();
      const email = parts[1].replace('>', '').trim();
      return {
        Name: name,
        Email: email
      };
    }
  } catch (error) {
    trackError(error);
    return {
      Name: '',
      Email: ''
    };
  }
};

interface IGetTypeSegregatedCcBCCData {
  Leads: (
    | {
        Name: string;
        Email: string;
      }
    | undefined
  )[];
  Users: (
    | {
        Name: string;
        Email: string;
      }
    | undefined
  )[];
}

export const getTypeSegregatedCcBccData = (
  dataString: string | undefined
): IGetTypeSegregatedCcBCCData => {
  if (!dataString) {
    return { Leads: [], Users: [] };
  }
  /* istanbul ignore next */
  try {
    const leadPattern = new RegExp('\\[MXL\\](.*?)\\[MXL\\]', 'g');
    const userPattern = new RegExp(
      '\\[(MX[UOM]|MXAOM|MXAO|MXOO|MXTO|MXMM|MXTOR)\\](.*?)\\[(MX[UOM]|MXAOM|MXAO|MXOO|MXTO|MXMM|MXTOR)\\]',
      'g'
    );

    const leadMatches = Array.from(dataString?.matchAll(leadPattern) || {});
    const leads = leadMatches?.map((match) => getOptionData(match?.[1]));

    const userMatches = Array.from(dataString?.matchAll(userPattern) || {});
    const users = userMatches?.map((match) => getOptionData(match?.[2]));

    return {
      Leads: leads || [],
      Users: users || []
    };
  } catch (error) {
    trackError(error);
    return { Leads: [], Users: [] };
  }
};

const getCcBccData = (mailMergeData: string): ICcBccData => {
  /* istanbul ignore next */
  const parsedMailMergeData: { MX_CC: string; MX_BCC: string } | null =
    safeParseJson(mailMergeData);
  const augmentedCcData = getTypeSegregatedCcBccData(parsedMailMergeData?.MX_CC);
  const augmentedBccData = getTypeSegregatedCcBccData(parsedMailMergeData?.MX_BCC);

  return {
    Cc: augmentedCcData,
    Bcc: augmentedBccData
  };
};

const getReplyToUserInfo = (mailMergeData: string): IReplyToData => {
  /* istanbul ignore next */
  try {
    const parsedMailMergeData: { ReplyTo: string } | null = safeParseJson(mailMergeData);
    if (parsedMailMergeData?.ReplyTo) {
      const regex = /(.+?)\s*<(.+?)>/;
      const match = parsedMailMergeData?.ReplyTo?.match(regex);

      if (match && match.length === 3) {
        const name = match[1];
        const email = match[2];
        return {
          name,
          email
        };
      }
    }
    return { name: '', email: '' };
  } catch (error) {
    trackError(error);
    return { name: '', email: '' };
  }
};

export { getBodyAndSubject, getSubjectExist, getCcBccData, getReplyToUserInfo };
