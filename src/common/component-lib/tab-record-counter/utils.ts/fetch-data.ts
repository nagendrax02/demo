import { getSettingConfig } from 'common/utils/helpers';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { RecordType, TASK_COUNTER_SETTING } from '../constants';

export const getTaskRecordCount = async (leadId: string): Promise<number | undefined> => {
  try {
    const isTaskCountSettingEnabled = await getSettingConfig(
      TASK_COUNTER_SETTING,
      CallerSource.LeadDetails
    );
    if (isTaskCountSettingEnabled) {
      const taskCount: number = await httpGet({
        path: `${API_ROUTES.TaskCountGet}?leadId=${leadId}`,
        module: Module.Marvin,
        callerSource: CallerSource.LeadDetails
      });
      return taskCount ?? undefined;
    }
  } catch (err) {
    console.log(err);
  }
  return undefined;
};

const recordCountUtilMap: Record<string, (leadId: string) => Promise<number | undefined>> = {
  [RecordType.Task]: getTaskRecordCount
};

export const getRecordCount = async (
  recordType: RecordType,
  leadId: string
): Promise<number | undefined> => {
  if (recordCountUtilMap?.[recordType]) {
    return recordCountUtilMap[recordType](leadId);
  }
};
