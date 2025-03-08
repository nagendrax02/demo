import { CallerSource, Module, httpPost } from '../../../utils/rest-client';
import { API_URL, CONSTANTS } from '../constants';
import { getContextText } from './editor';
import { ISaveTemplateResponse, ISendEmailFields } from '../send-email.types';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';

const getBody = (
  fields: ISendEmailFields,
  templateName: string
): Record<string, string | number> => {
  return {
    ContentTemplateId: fields.template?.value || '',
    ContentTemplateAutoId: 0,
    Name: templateName,
    Subject: fields.subject,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Content_Html: fields.contentHTML,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Content_Text: getContextText(fields.contentHTML),
    Layout: '',
    Type: 2,
    Category: 0
  };
};

const postTemplate = async (
  body: Record<string, string | number>,
  publish: boolean,
  callerSource: CallerSource
): Promise<ISaveTemplateResponse> => {
  const response = (await httpPost({
    path: `${API_URL.TEMPLATE_SAVE}?publish=${publish}`,
    module: Module.Marvin,
    body: body,
    callerSource
  })) as ISaveTemplateResponse;

  return response;
};

// eslint-disable-next-line max-lines-per-function
const saveTemplate = async ({
  fields,
  showAlert,
  setFields,
  templateName,
  publish = false,
  callerSource
}: {
  fields: ISendEmailFields;
  showAlert: (notification: INotification) => void;
  setFields: (value: Partial<ISendEmailFields>) => void;
  templateName: string;
  publish: boolean;
  callerSource: CallerSource;
}): Promise<void> => {
  try {
    const body = getBody(fields, templateName);

    const response = await postTemplate(body, publish, callerSource);

    if (response) {
      showAlert({
        type: Type.SUCCESS,
        message: response?.IsCreated
          ? CONSTANTS.TEMPLATE_ADDED_MSG.replace('{{name}}', templateName)
          : CONSTANTS.TEMPLATE_UPDATE_MSG.replace('{{name}}', templateName)
      });
      if (response.IsCreated) {
        setFields({
          template: {
            value: response.TemplateId,
            label: templateName
          }
        });
      }
    }
  } catch (err) {
    showAlert({
      type: Type.ERROR,
      message: err.message as string
    });
  }
};

export { saveTemplate };
