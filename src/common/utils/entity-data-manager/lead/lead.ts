import { trackError } from 'common/utils/experience/utils/track-error';
import { ILead, ILeadDetails, ILeadMetaData } from 'common/types';
import { fetchDetails } from './details';
import { fetchMetaData, fetchRepresentationName } from './metadata';
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
import { isLeadTypeEnabled } from '../../lead-type/settings';

const fetchDataOfNonLeadType = async (
  customLeadId?: string
): Promise<[ILeadDetails, ILeadMetaData, IEntityRepresentationName | undefined]> => {
  return Promise.all([
    fetchDetails(CallerSource.LeadDetails, customLeadId),
    fetchMetaData(CallerSource.LeadDetails),
    fetchRepresentationName(CallerSource.LeadDetails)
  ]);
};

// eslint-disable-next-line max-lines-per-function
const fetchData = async (customLeadId?: string): Promise<ILead> => {
  const experienceConfig = getExperienceKey();
  startExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.Load,
    event: EntityDetailsEvents.FetchApi,
    key: experienceConfig.key
  });
  try {
    const leadTypeEnabled = await isLeadTypeEnabled(CallerSource.LeadDetails);

    const [details, metaData, representationName] = leadTypeEnabled
      ? await (
          await import('../../lead-type/utils')
        ).fetchDataOfLeadType(CallerSource.LeadDetails, customLeadId)
      : await fetchDataOfNonLeadType(customLeadId);

    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.FetchApi,
      key: experienceConfig.key
    });

    return {
      details,
      metaData: {
        Fields: Object.values(metaData) || [],
        LeadRepresentationConfig: representationName
      }
    } as ILead;
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
