import { trackError } from 'common/utils/experience/utils/track-error';
import { fetchDetails } from './details';
import { fetchMetaData, fetchScheduledEmailCount } from './metadata';
import { CallerSource } from '../../rest-client';
import {
  getExperienceKey,
  startExperienceEvent,
  ExperienceType,
  endExperienceEvent,
  EntityDetailsEvents
} from '../../experience';
import { endEntityDetailsLoadExperience } from '../../experience/utils/module-utils';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IListDetails } from 'common/types/entity/list';
import { IList } from 'common/types/entity/list/list.types';
import { ILeadMetaData } from 'common/types';
import { fetchRepresentationName } from '../lead/metadata';
import { getListId } from '../../helpers/helpers';

const fetchDataOfNonLeadType = async (
  listId: string
): Promise<[IListDetails, ILeadMetaData, number, IEntityRepresentationName | undefined]> => {
  return Promise.all([
    fetchDetails(CallerSource.ListDetails),
    fetchMetaData(CallerSource.LeadDetails),
    fetchScheduledEmailCount(CallerSource.ListDetails, listId),
    fetchRepresentationName(CallerSource.ListDetails)
  ]);
};

const fetchData = async (): Promise<IList> => {
  const experienceConfig = getExperienceKey();
  startExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.Load,
    event: EntityDetailsEvents.FetchApi,
    key: experienceConfig.key
  });
  try {
    const listId = getListId();
    const [details, metaData, scheduledEmailCount, representationName] =
      await fetchDataOfNonLeadType(listId as string);

    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.FetchApi,
      key: experienceConfig.key
    });

    return {
      details: { ...details, customActions: {} },
      metaData: {
        Fields: Object.values(metaData) || [],
        LeadRepresentationConfig: representationName
      },
      scheduledEmailCount
    } as IList;
  } catch (error) {
    trackError(error);
    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.FetchApi,
      key: experienceConfig.key,
      hasException: true
    });
    endEntityDetailsLoadExperience();
    throw error;
  }
};

export { fetchData };
