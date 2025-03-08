import { useEffect, useState } from 'react';
import { IAutomationTooltipDetails } from 'apps/activity-history/types';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';

interface IUseAutomationText {
  isClicked: boolean;
  campaignActivityRecordId: string | undefined;
  leadApiUrl?: string;
  automationToolTipDetails?: IAutomationTooltipDetails;
}

interface IData {
  Name: string;
  Action: string;
}

const useAutomationText = ({
  isClicked,
  campaignActivityRecordId,
  leadApiUrl,
  automationToolTipDetails
}: IUseAutomationText): { isLoading: boolean; data: IData } => {
  const { showAlert } = useNotification();
  const [data, setData] = useState<IData>({ Name: '', Action: '' });
  const [isLoading, setIsLoading] = useState(false);

  const automationId = (
    automationToolTipDetails?.Id ? automationToolTipDetails?.Id : campaignActivityRecordId
  ) as string;

  const url = leadApiUrl || API_ROUTES.retrieveAutomationName;

  useEffect(() => {
    const getAutomationName = async (): Promise<void> => {
      try {
        if (isClicked && automationId && !data.Name) {
          setIsLoading(true);
          const response = (await httpGet({
            path: `${url}${automationId}`,
            module: Module.Marvin,
            callerSource: CallerSource.ActivityHistory
          })) as Record<string, string>[] | string;
          if (leadApiUrl) {
            setData({
              Name: (response as Record<string, string>[])[1]?.Value,
              Action: automationToolTipDetails?.Action as string
            });
          } else {
            setData({ Name: response as string, Action: '' });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        const exceptionMessage = (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE;
        showAlert({ type: Type.ERROR, message: exceptionMessage });
        setIsLoading(false);
      }
    };
    getAutomationName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automationId, isClicked]);

  return { isLoading, data };
};

export default useAutomationText;
