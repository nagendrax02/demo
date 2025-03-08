import { trackError } from 'common/utils/experience/utils/track-error';
import { ERROR_MSG } from '../../../constants';
import { isValidGuid } from '../../helpers';

const validateEntityId = (entityId: string): void => {
  if (!entityId || !isValidGuid(entityId)) {
    trackError(ERROR_MSG.invalidEntityId);
    throw new Error(ERROR_MSG.invalidEntityId);
  }
};

export { validateEntityId };
