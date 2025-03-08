import { trackError } from 'common/utils/experience/utils/track-error';
import { noteParser } from 'common/utils/helpers/activity-history';
import { connectEmailActivityKeys } from './constants';

export const checkConnectorEmailOnS3 = (eventNote: string): boolean => {
  return (
    eventNote?.includes(connectEmailActivityKeys.CONTENT_URL_STARTS) &&
    eventNote?.includes(connectEmailActivityKeys.CONTENT_URL_ENDS) &&
    eventNote?.includes(connectEmailActivityKeys.CONTENT_SUMMARY_STARTS) &&
    eventNote?.includes(connectEmailActivityKeys.CONTENT_SUMMARY_ENDS)
  );
};

export const checkIsCustomEmail = (eventNote: string): boolean => {
  const eventNoteCased = eventNote?.toLowerCase();
  return !!(
    (eventNoteCased?.includes('mail subject:{=}') || eventNoteCased?.includes('mail to:{=}')) &&
    eventNoteCased?.includes('{next}mail body:{=}')
  );
};

export const getParsedMailBody = (body: string): string => {
  let parsedBody = '';
  try {
    const startKeyword = connectEmailActivityKeys.CONTENT_SUMMARY_STARTS;
    const endKeyword = connectEmailActivityKeys.CONTENT_SUMMARY_ENDS;

    if (body.includes(startKeyword) && body.includes(endKeyword)) {
      const startIndex = body.indexOf(startKeyword) + startKeyword.length;
      const endIndex = body.indexOf(endKeyword);
      parsedBody = `${body.substring(startIndex, endIndex).trim()}...`;
    } else {
      parsedBody = 'No description found';
    }
    return parsedBody;
  } catch (error) {
    trackError(error);
  }
  return parsedBody;
};

export const getParsedActivityNote = (
  activityEventNote: string
): { [key: string]: string } | null => {
  return noteParser(activityEventNote?.replace(/(\t|\n|\r)/gi, ''));
};

const extractValue = (value: string, startKey: string, endKey: string): string => {
  return value?.substring(value.indexOf(startKey) + startKey.length, value.indexOf(endKey))?.trim();
};

export const getIFrameContent = (value: string): string => {
  const emailDesc = extractValue(
    value,
    connectEmailActivityKeys.CONTENT_SUMMARY_STARTS,
    connectEmailActivityKeys.CONTENT_SUMMARY_ENDS
  );
  return emailDesc || '';
};

export const getIFrameUrl = (value: string): string => {
  let contentUrl = '';
  if (
    value?.includes(connectEmailActivityKeys.CONTENT_URL_STARTS) &&
    value?.includes(connectEmailActivityKeys.CONTENT_URL_ENDS)
  ) {
    contentUrl = extractValue(
      value,
      connectEmailActivityKeys.CONTENT_URL_STARTS,
      connectEmailActivityKeys.CONTENT_URL_ENDS
    );
    return contentUrl;
  }
  return contentUrl;
};

export const isValidUrl = async (url: string): Promise<boolean> => {
  if (!url) {
    return false;
  }

  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true;
  } catch (error) {
    return false;
  }
};
