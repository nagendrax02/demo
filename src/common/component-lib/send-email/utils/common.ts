import { LIST_SEND_EMAIL_SUCCESS_MESSAGE, SCHEDULE_SUCCESS_MESSAGE } from '../constants';
import { IOption } from '../send-email.types';

const getValidFileName = (oldName: string): string => {
  let fileNameWithoutExtension = oldName.split('.');
  if (fileNameWithoutExtension.length > 1) {
    fileNameWithoutExtension = oldName.split(`.${oldName.split('.').pop()}`);
    return fileNameWithoutExtension[0];
  } else return oldName;
};

const getSendEmailSuccessMessage = ({
  response,
  toField,
  enableTestEmailFeature,
  dateTime
}: {
  response: Record<string, string>;
  toField: IOption[];
  enableTestEmailFeature?: boolean;
  dateTime?: string;
}): string | undefined => {
  if (enableTestEmailFeature) {
    return LIST_SEND_EMAIL_SUCCESS_MESSAGE.replace('{memberCount}', response?.MemberCount)
      .replace('{totalRecepeirnts}', response?.TotalRecipient)
      .replace('{name}', toField?.[0]?.label);
  }
  if (dateTime) {
    return SCHEDULE_SUCCESS_MESSAGE;
  }

  return undefined;
};

export { getValidFileName, getSendEmailSuccessMessage };
