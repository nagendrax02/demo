import { trackError } from 'common/utils/experience/utils/track-error';
import { isMiP } from 'common/utils/helpers';

const closeEntityDetails = (event: MessageEvent): void => {
  if (event?.data?.payload && !isMiP()) {
    trackError('Close Entity Details');
  }
};

export default closeEntityDetails;
