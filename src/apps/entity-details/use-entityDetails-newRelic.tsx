import { useEffect, useMemo, useRef } from 'react';
import useEntityDetailStore from './entitydetail.store';
import {
  getExperienceKey,
  startExperienceEvent,
  ExperienceType,
  endExperienceEvent
} from 'common/utils/experience';

const useEntityDetailsNewRelic = ({
  event,
  conditionToStop
}: {
  event: string;
  conditionToStop?: boolean;
}): void => {
  const { isUpdating } = useEntityDetailStore();
  const experienceConfig = getExperienceKey();
  const isEventStarted = useRef(true);
  useMemo(() => {
    if (isUpdating) {
      isEventStarted.current = true;
      startExperienceEvent({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        event,
        key: experienceConfig.key
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating]);

  useEffect(() => {
    if (!isUpdating && (typeof conditionToStop === 'boolean' ? conditionToStop : true)) {
      isEventStarted.current = false;
      endExperienceEvent({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        event,
        key: experienceConfig.key
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating, conditionToStop]);
};

export default useEntityDetailsNewRelic;
