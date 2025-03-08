import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'common/utils/rest-client';
import { fetchActivityMetadata } from './account-activity';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getAccountMetaData } from './accountMetaData';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { EntityType } from 'common/types';

export const fetchActivityAndAccountMetaData = async (
  accountType: string,
  activityType: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  accountRepName: IEntityRepresentationName;
  activityRepName: IEntityRepresentationName;
}> => {
  try {
    const [accountMetaData, activityMetaData] = await Promise.all([
      getAccountMetaData(accountType),
      fetchActivityMetadata(activityType, CallerSource.SmartViews)
    ]);

    return {
      metaDataMap: { ...accountMetaData?.metaDataMap, ...activityMetaData?.metaDataMap },
      accountRepName: accountMetaData.representationName,
      activityRepName: activityMetaData.representationName
    };
  } catch (error) {
    trackError(error);
  }
  return {
    metaDataMap: {},
    accountRepName: DEFAULT_ENTITY_REP_NAMES.account,
    activityRepName: DEFAULT_ENTITY_REP_NAMES[EntityType.AccountActivity]
  };
};
