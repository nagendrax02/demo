import { trackError } from 'common/utils/experience/utils/track-error';
import { IProcessResponse, IWorkAreaConfig } from 'common/utils/process/process.types';
import { fetchMultipleWorkAreaProcessForms } from 'common/utils/process/process';
import { workAreaIds } from 'common/utils/process';
import { CallerSource } from 'src/common/utils/rest-client';

interface IWorkArea {
  WorkAreaId: number;
  AdditionalData?: string;
}
interface IGetProcessFormsProcessor {
  events: IWorkArea[];
  opportunityCode: string;
}

const isAgentPopupWorkArea = (workAreaId: number): boolean => {
  const agentPopupWorkArea = workAreaIds.TELEPHONY.AGENT_POPUP;
  return (
    workAreaId === agentPopupWorkArea.INBOUND_PHONE_CALL ||
    workAreaId === agentPopupWorkArea.OUTBOUND_PHONE_CALL
  );
};

const getFilteredProcessForms = (
  workAreaIdProcess: IProcessResponse,
  opportunityCode: string
): IProcessResponse => {
  if (!workAreaIdProcess?.ActionOutputs) return workAreaIdProcess;

  const filteredProcessForms = workAreaIdProcess?.ActionOutputs.filter(
    (processForm) => processForm.Entity?.OpportunityCode === opportunityCode
  );

  if (!filteredProcessForms?.length) {
    return workAreaIdProcess;
  }

  workAreaIdProcess.ActionOutputs = filteredProcessForms;
  return workAreaIdProcess;
};

const getEvents = (events: IWorkArea[]): IWorkAreaConfig[] => {
  return events?.map((event) => {
    return {
      ...event,
      workAreaId: event.WorkAreaId,
      additionalData: event.AdditionalData
    };
  });
};

const getFilterEvents = (
  opportunityCode: string,
  relatedForms: IProcessResponse[]
): IProcessResponse[] => {
  try {
    return relatedForms.map((process) => {
      if (!process?.Event) return process;

      if (isAgentPopupWorkArea(process.Event.WorkAreaId))
        return getFilteredProcessForms(process, opportunityCode);
      return process;
    });
  } catch (error) {
    trackError(error);
  }
  return relatedForms;
};

const getFilteredRelatedForms = (
  events: IWorkArea[],
  relatedForms: IProcessResponse[]
): IProcessResponse[] => {
  try {
    const selectedWorkAreaIds: Record<number, boolean> = {};

    events.forEach((event) => {
      selectedWorkAreaIds[event?.WorkAreaId] = true;
    });

    return relatedForms.filter((form) => {
      return selectedWorkAreaIds[form.Event?.WorkAreaId || -1];
    });
  } catch (err) {
    trackError('Error in getFilteredRelatedForms', err);
    return relatedForms;
  }
};

const getProcessFormsProcessor = async (event: MessageEvent): Promise<void> => {
  try {
    const { events, opportunityCode } = event?.data?.payload as IGetProcessFormsProcessor;
    let relatedForms = Object.values(
      (await fetchMultipleWorkAreaProcessForms(getEvents(events), CallerSource.ExternalApp)) || {}
    );

    if (opportunityCode) {
      relatedForms = getFilterEvents(opportunityCode, relatedForms);
    }

    relatedForms = getFilteredRelatedForms(events, relatedForms);

    if (event?.ports[0]) event?.ports[0].postMessage(relatedForms);
  } catch (ex) {
    trackError('Error in getProcessWorkAreaProcessor :', ex);
  }
};

export default getProcessFormsProcessor;
