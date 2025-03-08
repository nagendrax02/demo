import { ReactNode, useEffect, useState } from 'react';
import { CallerSource } from 'common/utils/rest-client';
import { isFeatureRestricted } from './utils/augment-data';
import useFeatureRestrictionStore from './use-feature-restriction-store';
import { isMiP } from '../helpers';
import { FeatureRestrictionModuleTypes } from './feature-restriction.types';

interface IFeatureRestriction {
  actionName: string;
  moduleName: FeatureRestrictionModuleTypes;
  children: ReactNode;
  callerSource: CallerSource;
  placeholderElement?: JSX.Element;
  fallbackElement?: JSX.Element;
  onRestrictionChange?: (isRestricted: boolean) => void;
}

const FeatureRestriction = ({
  actionName,
  moduleName,
  children,
  placeholderElement,
  callerSource,
  fallbackElement,
  onRestrictionChange
}: IFeatureRestriction): ReactNode => {
  const { isLoading, restrictionData } = useFeatureRestrictionStore();
  const [isRestricted, setIsRestricted] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isLoading && restrictionData) {
        const response = await isFeatureRestricted({
          actionName,
          moduleName,
          restrictionData,
          callerSource: callerSource
        });
        setIsRestricted(response);
        onRestrictionChange?.(response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, restrictionData]);

  if (isMiP()) {
    return children;
  } else if (isLoading) {
    return placeholderElement ? placeholderElement : null;
  } else if (!isRestricted) {
    return children;
  }

  return fallbackElement ? fallbackElement : null;
};

FeatureRestriction.defaultProps = {
  placeholderElement: null,
  fallbackElement: null,
  onRestrictionChange: null
};

export default FeatureRestriction;
