import { FeatureRestrictionConfigMap } from 'apps/entity-details/types/entity-data.types';
import { isMiP } from '../../helpers';
import { CallerSource } from '../../rest-client';
import { IRestrictionData } from '../feature-restriction.types';
import { getFeatureRestrictionData } from './fetch-data';

const isActionRestricted = ({
  rawData,
  actionName,
  moduleName,
  moduleRestriction
}: {
  rawData: IRestrictionData | undefined;
  actionName: string;
  moduleName: string;
  moduleRestriction: number;
}): boolean => {
  const action = rawData?.userActions?.get(`${moduleName}-${actionName}`) || 0;
  return (moduleRestriction & action) > 0;
};

export const isFeatureRestricted = async ({
  moduleName,
  actionName,
  callerSource,
  restrictionData
}: {
  actionName: string;
  moduleName: string;
  restrictionData?: IRestrictionData;
  callerSource: CallerSource;
}): Promise<boolean> => {
  if (isMiP()) return false;
  let rawData = restrictionData;
  if (!rawData) {
    rawData = await getFeatureRestrictionData(callerSource);
  }
  const maxExpValue: bigint = 18446744073709551614n;
  const moduleRestriction = rawData.userRestrictions?.get(moduleName || '');

  if (!moduleRestriction || rawData?.userRestrictions?.size === 0) {
    return false;
  }

  if (BigInt(moduleRestriction) >= maxExpValue) return true;
  return isActionRestricted({ rawData, actionName, moduleName, moduleRestriction });
};

export const getUnrestrictedActions = async <
  K extends {
    id?: string;
  }
>(
  featureRestrictionConfigMap: FeatureRestrictionConfigMap,
  actions: K[]
): Promise<K[]> => {
  const restrictionMap: Record<string, boolean> = {};
  if (featureRestrictionConfigMap) {
    const keys = Object.keys(featureRestrictionConfigMap);
    const promises = keys.map((key) => isFeatureRestricted(featureRestrictionConfigMap?.[key]));

    const results = await Promise.all(promises);

    keys.forEach((key, index) => {
      restrictionMap[key] = results?.[index];
    });
  }

  const filteredActions = actions?.filter((action) => !restrictionMap?.[action?.id ?? '']);

  return filteredActions;
};
