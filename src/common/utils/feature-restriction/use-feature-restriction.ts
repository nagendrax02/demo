import { useEffect } from 'react';
import { CallerSource } from '../rest-client';
import useFeatureRestrictionStore from './use-feature-restriction-store';
import { getFeatureRestrictionData } from './utils/fetch-data';
import { isMiP } from '../helpers';

const useFeatureRestriction = (callerSource: CallerSource): void => {
  const { setIsLoading, setRestrictionData } = useFeatureRestrictionStore();

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isMiP()) {
        setIsLoading(true);
        const response = await getFeatureRestrictionData(callerSource);
        setRestrictionData(response);
      }
      setIsLoading(false);
    })();
  }, []);
};

export default useFeatureRestriction;
