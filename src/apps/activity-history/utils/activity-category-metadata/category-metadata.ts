import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { IActivityCategoryMetadata } from '../../types';
import { getCategoryMetadataCache, setCategoryMetadataCache } from './cache-category-metadata';
import { getAccountTypeId } from 'common/utils/helpers/helpers';
import { EntityType } from 'common/types';

const getActivityCategoryMetaData = async (
  type?: EntityType,
  activityEvent?: string
): Promise<IActivityCategoryMetadata[]> => {
  try {
    if (type === EntityType.Account) {
      return await httpGet({
        path: `${API_ROUTES.accountActivityCategoryMetadata}?accountTypeId=${getAccountTypeId()}`,
        module: Module.Marvin,
        callerSource: CallerSource.AccountActivityHistory
      });
    }
    if (type === EntityType.Opportunity) {
      return await httpGet({
        path: `${API_ROUTES.activityCategoryMetadata}?activityEvent=${activityEvent}&pageSource=OpportunityDetails`,
        module: Module.Marvin,
        callerSource: CallerSource.OpportunityDetailsActivityHistory
      });
    }
    return await httpGet({
      path: API_ROUTES.activityCategoryMetadata,
      module: Module.Marvin,
      callerSource: CallerSource.ActivityHistory
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchCategoryMetadata = async (
  type?: EntityType,
  activityEvent?: string
): Promise<IActivityCategoryMetadata[]> => {
  try {
    const cachedCategoriesMetadata = getCategoryMetadataCache(type);
    if (cachedCategoriesMetadata) return cachedCategoriesMetadata;

    let response = await getActivityCategoryMetaData(type, activityEvent);
    if (response) {
      response = response.sort((a, b) =>
        (a.Text || '').toLowerCase() > (b.Text || '').toLowerCase() ? 1 : -1
      ) as IActivityCategoryMetadata[];

      setCategoryMetadataCache(response, type);
    }

    return response;
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { fetchCategoryMetadata };
