import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { IListDetails } from 'common/types/entity/list';
import { getListId } from '../../helpers/helpers';

const getListDetails = async (
  callerSource: CallerSource,
  listId: string | null
): Promise<IListDetails> => {
  try {
    return await httpGet({
      path: `${API_ROUTES.listDetails}?Id=${listId}`,
      module: Module.Marvin,
      callerSource: callerSource
    });
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const fetchDetails = async (callerSource: CallerSource): Promise<IListDetails> => {
  try {
    const listId = getListId();
    return await getListDetails(callerSource, listId);
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { fetchDetails, getListDetails };
