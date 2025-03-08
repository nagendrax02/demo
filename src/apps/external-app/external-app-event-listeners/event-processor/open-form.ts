import { trackError } from 'common/utils/experience/utils/track-error';
import { IFormData, IFormOnSuccessCallBack } from 'apps/forms/forms.types';
import { getEntityId } from 'common/utils/helpers';
import { debounce, handleEntityUpdate } from 'common/utils/helpers/helpers';
import { publishExternalAppEvent } from '../../event-handler';

const onSuccess = (event: MessageEvent, formSubmitData: IFormOnSuccessCallBack): void => {
  try {
    const formData = formSubmitData && formSubmitData?.FormData && formSubmitData?.FormData[0];
    const leadId = ((formData as { LeadDetail: { Id: string } })?.LeadDetail?.Id ||
      getEntityId()) as string;
    const oppId = (formData as { OpportunityDetail: { Id: string } })?.OpportunityDetail?.Id;

    //TODO: opportunity id should check  getOpportunityId();
    handleEntityUpdate(leadId, oppId);

    if (event?.ports[0]) event?.ports[0]?.postMessage(formSubmitData);
  } catch (error) {
    trackError('Error in open form processor', error);
  }
};

const changeKeyToPascalCase = <T>(obj: T): T => {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    const result = {} as T;
    for (const key in obj) {
      const capitalizeKey = key?.charAt(0).toUpperCase() + key?.slice(1);
      result[capitalizeKey] = changeKeyToPascalCase(obj?.[key]);
    }
    return result;
  } catch (error) {
    trackError(error);
  }
  return obj;
};

const openFormProcessor = (event: MessageEvent): void => {
  try {
    const formConfig: IFormData = {
      ...(event.data.payload as IFormData),
      OnSuccess: (formSubmitData: IFormOnSuccessCallBack) => {
        onSuccess(event, formSubmitData);
      }
    };
    const updateFormConfig = changeKeyToPascalCase(formConfig);
    console.log(updateFormConfig);
    debounce(() => {
      publishExternalAppEvent('external-app-forms', formConfig);
    }, 500)();
  } catch (error) {
    trackError(error);
  }
};

export default openFormProcessor;
