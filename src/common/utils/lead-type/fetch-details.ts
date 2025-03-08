import { trackError } from 'common/utils/experience/utils/track-error';
import { ILeadDetails } from 'common/types';
import { ICachedLeadDetails } from 'common/types/entity/lead';
import { getFromDB, setInDB, StorageKey } from 'common/utils/storage-manager';
import { getLeadDetails } from 'common/utils/entity-data-manager/lead/details';
import { CallerSource } from 'common/utils/rest-client';

const getLeadDetailsCache = async (
  leadType: string | null
): Promise<ICachedLeadDetails | undefined> => {
  try {
    const cacheData = (await getFromDB(StorageKey.LDLeadTypeCompoundData)) as Record<
      string,
      ICachedLeadDetails
    >;

    return cacheData[leadType ?? ''];
  } catch (error) {
    trackError(error);
  }
};

const setLeadDetailsCache = async (leadType: string, leadDetails: ILeadDetails): Promise<void> => {
  try {
    const { Fields, ...filteredLeadDetails } = leadDetails;
    const currentCache = await getLeadDetailsCache(leadType);
    const updatedCache = { ...currentCache, [leadType]: filteredLeadDetails };

    setInDB(StorageKey.LDLeadTypeCompoundData, updatedCache, true);
  } catch (error) {
    trackError(error);
  }
};

const fetchDetailsOfLeadType = async (
  callerSource: CallerSource,
  customLeadId?: string,
  leadType?: string
): Promise<ILeadDetails> => {
  const cachedLeadDetails = await getLeadDetailsCache(leadType ?? '');
  let response = await getLeadDetails(callerSource, cachedLeadDetails, customLeadId);

  if (cachedLeadDetails) {
    response = { ...response, ...cachedLeadDetails };
  } else if (leadType) {
    setLeadDetailsCache(leadType, response);
  }

  return response;
};

export { fetchDetailsOfLeadType };
