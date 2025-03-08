import { trackError } from 'common/utils/experience/utils/track-error';
import { getEntityId } from 'common/utils/helpers';
import { IGetExperienceKey } from '../experience.types';
import { ExperienceModule } from '../experience-modules';
import { getAccountId, getOpportunityId, roundOffDecimal } from '../../helpers/helpers';
import {
  ManageLeadLoadExperienceKey,
  ManageTaskLoadExperienceKey,
  SVLoadExperienceKey
} from '../constant';
import { APP_ROUTE } from 'common/constants';

export const getExperienceName = ({
  module,
  experience,
  key
}: {
  module: string;
  experience: string;
  key: string;
}): string => {
  return `${key}-${module}-${experience}`;
};

export const getExperienceEventName = ({
  event,
  experience,
  module,
  key
}: {
  module: string;
  experience: string;
  event: string;
  key: string;
}): string => {
  return `${key}-${module}-${experience}-${event}`;
};

export const validateExperience = ({
  module,
  experience,
  key
}: {
  module: string;
  experience: string;
  key: string;
}): boolean => {
  if (!module || !experience || !key) {
    trackError('Invalid experience requirements', { module, experience, key });
    return false;
  }
  return true;
};

export const validateEvent = ({
  module,
  experience,
  event,
  key
}: {
  module: string;
  experience: string;
  event: string;
  key: string;
}): boolean => {
  if (!module || !experience || !event || !key) {
    trackError('Invalid experience event requirements', { module, experience, key, event });
    return false;
  }
  return true;
};

// eslint-disable-next-line complexity, max-lines-per-function
export const getExperienceKey = (): IGetExperienceKey => {
  try {
    if (getEntityId()) {
      return {
        module: ExperienceModule.LeadDetails,
        key: getEntityId()
      };
    } else if (getAccountId()) {
      return {
        module: ExperienceModule.AccountDetails,
        key: getAccountId()
      };
    } else if (getOpportunityId()) {
      return {
        module: ExperienceModule.OpportunityDetails,
        key: getOpportunityId()
      };
    } else if (
      self.location.pathname?.toLowerCase() === '/smartviews' ||
      self.location.pathname?.toLowerCase() === '/leadmanagement/smartviews'
    ) {
      return {
        module: ExperienceModule.SmartViews,
        key: SVLoadExperienceKey
      };
    } else if (
      [APP_ROUTE.platformManageLeadsIndex, APP_ROUTE.platformManageLeads]?.includes(
        self.location.pathname?.toLowerCase()
      )
    ) {
      return {
        module: ExperienceModule.ManageLeads,
        key: ManageLeadLoadExperienceKey
      };
    } else if (self.location.pathname?.toLowerCase() === APP_ROUTE.platformManageTasks) {
      return {
        module: ExperienceModule.ManageTask,
        key: ManageTaskLoadExperienceKey
      };
    }
  } catch (error) {
    trackError(error);
  }
  return { module: '', key: '' };
};

export const getNavigationTimings = (): { responseEnd?: number } => {
  try {
    const [pageNav] = performance.getEntriesByType('navigation');
    return pageNav as unknown as { responseEnd?: number };
  } catch (error) {
    trackError(error);
  }
  return { responseEnd: (self?.['app-initial-load'] as number) || 0 };
};

export const getNavigationTimingLogs = (
  logServerResponseTime?: boolean
): { serverResponseTime?: number | null; performanceNavigationTiming?: string | null } => {
  try {
    if (!logServerResponseTime) return {};

    return {
      serverResponseTime: logServerResponseTime
        ? roundOffDecimal(getNavigationTimings()?.responseEnd || 0) || null
        : null,
      performanceNavigationTiming: logServerResponseTime
        ? JSON.stringify(getNavigationTimings())
        : null
    };
  } catch (error) {
    trackError(error);
  }
  return {};
};
