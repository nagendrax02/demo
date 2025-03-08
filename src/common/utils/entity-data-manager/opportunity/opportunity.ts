import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunity } from 'common/types';
import { fetchDetails } from './details';
import { fetchMetaData } from './metadata';
import { CallerSource } from '../../rest-client';
import { fetchRepresentationName } from '../lead/metadata';
import {
  EntityDetailsEvents,
  ExperienceModule,
  ExperienceType,
  endExperienceEvent,
  getExperienceKey,
  startExperienceEvent
} from 'common/utils/experience';
import { endEntityDetailsLoadExperience } from '../../experience/utils/module-utils';
import { getOpportunityRepresentationName } from '../../helpers';
import { persistOppRepName } from '../../helpers/opportunity-name-rep';

const fetchOppData = async (): Promise<IOpportunity> => {
  const [details, metaData, leadRepName, oppRepName] = await Promise.all([
    fetchDetails(CallerSource.OpportunityDetails),
    fetchMetaData(CallerSource.OpportunityDetails),
    fetchRepresentationName(CallerSource.OpportunityDetails),
    getOpportunityRepresentationName(CallerSource.OpportunityDetails)
  ]);
  details.LeadRepresentationName = leadRepName;
  details.EntityAttribute = metaData?.Fields || {};
  details.OppRepresentationName = {
    Singular: oppRepName?.OpportunityRepresentationSingularName || '',
    Plural: oppRepName?.OpportunityRepresentationPluralName || ''
  };
  details.CanDelete = metaData?.CanDelete;

  persistOppRepName({
    OpportunityRepresentationSingularName:
      oppRepName?.OpportunityRepresentationSingularName || 'Opportunity',
    OpportunityRepresentationPluralName:
      oppRepName?.OpportunityRepresentationPluralName || 'Opportunities'
  });

  return { details, metaData };
};

const fetchData = async (): Promise<IOpportunity> => {
  const experienceConfig = getExperienceKey();
  startExperienceEvent({
    module: ExperienceModule.OpportunityDetails,
    experience: ExperienceType.Load,
    event: EntityDetailsEvents.FetchApi,
    key: experienceConfig.key
  });
  try {
    const { details, metaData } = await fetchOppData();

    endExperienceEvent({
      module: ExperienceModule.OpportunityDetails,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.FetchApi,
      key: experienceConfig.key
    });

    return {
      details,
      metaData
    } as IOpportunity;
  } catch (error) {
    trackError(error);
    endExperienceEvent({
      module: ExperienceModule.OpportunityDetails,
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
