import { trackError } from 'common/utils/experience/utils/track-error';
import { showHeaderOverlay } from 'apps/header/header.store';
import { DashboardType } from './dashboard.types';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';

export const onMessageReceive = async (data: {
  type: string;
  message: Record<string, unknown>;
}): Promise<void> => {
  try {
    const events = {
      ['SWLITE_MODAL_TRIGGER']: (): void => {
        showHeaderOverlay((data?.message?.isModalOpened as boolean) || false);
      }
    };

    await events?.[data.type]?.();
  } catch (error) {
    trackError(error);
  }
};

export const getIsCasaEnabled = async (): Promise<boolean> => {
  try {
    const response = (await httpGet({
      path: API_ROUTES.DashboardUsers,
      module: Module.FieldSales,
      callerSource: CallerSource.Dashboard
    })) as unknown[];
    // Caching data is pending
    if (response?.length) return true;
  } catch (err) {
    trackError(err);
  }
  return false;
};

export const fetchDashboardType = async (): Promise<DashboardType> => {
  try {
    const isCasaEnabled = await getIsCasaEnabled();
    if (isCasaEnabled) return DashboardType.Casa;
  } catch (err) {
    trackError(err);
  }
  return DashboardType.Default;
};
