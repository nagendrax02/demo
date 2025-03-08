import { IFormsConfigurationDataToBePassed } from './forms.types';

type IFunctionType = (...args) => void;

interface IGenerateCallbackMapFromFormsData {
  formDataToBePassed: IFormsConfigurationDataToBePassed;
}

interface IAppendCallBackSetToFormData {
  formDataToBePassed: IFormsConfigurationDataToBePassed;
  callBackMap: Map<string, IFunctionType>;
}

const generateCallbackMapFromFormsData = (
  callbackData: IGenerateCallbackMapFromFormsData | null
): Map<string, IFunctionType> | null => {
  if (!callbackData) return null;
  const { formDataToBePassed } = callbackData;
  if (!formDataToBePassed) return null;
  const callBackMap: Map<string, IFunctionType> = new Map();
  for (const [key, value] of Object.entries(formDataToBePassed)) {
    if (typeof value === 'function') {
      callBackMap.set(key, value);
      formDataToBePassed[key] = key;
    }
  }

  return callBackMap;
};

const appendCallBackSetToFormData = ({
  formDataToBePassed,
  callBackMap
}: IAppendCallBackSetToFormData): null | void => {
  if (!formDataToBePassed || !callBackMap) return null;
  if (callBackMap.size) {
    const callBackNameSet: Set<string> = new Set();
    for (const key of callBackMap.keys()) {
      callBackNameSet.add(key);
    }
    formDataToBePassed.CallBackNameSet = callBackNameSet;
  }
};

export default generateCallbackMapFromFormsData;
export { appendCallBackSetToFormData };
