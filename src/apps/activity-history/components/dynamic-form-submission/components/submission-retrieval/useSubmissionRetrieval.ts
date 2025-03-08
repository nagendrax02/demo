/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import { trackError } from 'common/utils/experience/utils/track-error';
import { getCapturedFromConfig, getFormSubmissionData, getNormalizedSubmissionData } from './utils';
import {
  ICapturedFromConfig,
  INormalizedSubmissionRetrievalData,
  ISubmitRetrievalData
} from './submission-retrieval.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { EXCEPTION_MESSAGE } from 'src/common/constants';
import { useLeadRepName } from 'src/apps/entity-details/entitydetail.store';
import { UnableRetrieveData } from '../../constants';

interface IUseSubmissionRetrieval {
  submissionFormId: string;
}

interface IAugmentedSubmissionData {
  isLoading: boolean;
  isDataExist: boolean;
  normalizedData: INormalizedSubmissionRetrievalData[] | undefined;
  formName: string | undefined;
  previewUrl: string | undefined;
  capturedFromConfig?: ICapturedFromConfig;
}
interface IAugmentedData {
  normalizedData: INormalizedSubmissionRetrievalData[];
  formName: string;
  previewUrl: string;
  capturedFromConfig?: ICapturedFromConfig;
}

const getIsDataExist = (data: ISubmitRetrievalData): boolean => {
  const formEntity = data?.FormEntity || {};
  const leadFields = formEntity?.LeadFields;
  const opportunityFields = formEntity?.OpportunityFields;
  const activityFields = formEntity?.ActivityFields;
  const taskFields = formEntity?.TaskFields;

  return !(
    leadFields &&
    !leadFields?.length &&
    opportunityFields &&
    !opportunityFields?.length &&
    activityFields &&
    !activityFields?.length &&
    taskFields &&
    !taskFields?.length
  );
};

// eslint-disable-next-line max-lines-per-function
const useSubmissionRetrieval = ({
  submissionFormId
}: IUseSubmissionRetrieval): IAugmentedSubmissionData => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataExist, setIsDataExist] = useState(true);
  const [augmentedData, setAugmentedData] = useState<IAugmentedData>({
    normalizedData: [],
    formName: '',
    previewUrl: ''
  });
  const { showAlert } = useNotification();
  const leadRepName = useLeadRepName();

  useEffect(() => {
    const fetchSubmissionData = async (): Promise<void> => {
      try {
        if (submissionFormId) {
          setIsLoading(true);
          const data: ISubmitRetrievalData = await getFormSubmissionData(submissionFormId);
          const dataExist = getIsDataExist(data);
          if (!dataExist) {
            showAlert({ type: Type.ERROR, message: UnableRetrieveData });
            setIsDataExist(false);
          } else {
            setAugmentedData({
              normalizedData: getNormalizedSubmissionData(data, leadRepName?.SingularName),
              formName: data?.SubmissionFormName,
              previewUrl: data?.FormEntity?.PreviewS3Id || '',
              capturedFromConfig: getCapturedFromConfig(data)
            });
          }
          setIsLoading(false);
        }
      } catch (error) {
        trackError(error);
        setIsDataExist(false);
        setIsLoading(false);
        showAlert({
          type: Type.ERROR,
          message: (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE
        });
      }
    };
    fetchSubmissionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionFormId]);

  return { ...augmentedData, isLoading, isDataExist };
};

export default useSubmissionRetrieval;
