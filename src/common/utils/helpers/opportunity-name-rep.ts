import { trackError } from 'common/utils/experience/utils/track-error';
import { IOppRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpGet } from '../rest-client';
import { StorageKey, getItem, setItem } from '../storage-manager';

const getOppRepNameFromStorage = (): IOppRepresentationName | null => {
  return getItem(StorageKey.OpportunityRepName);
};

export const persistOppRepName = (name: IOppRepresentationName): void => {
  setItem(StorageKey.OpportunityRepName, name);
};

const getOpportunityRepresentationName = async (
  callerSource: CallerSource
): Promise<IOppRepresentationName> => {
  try {
    let opportunityRepresentationName = getOppRepNameFromStorage();
    if (opportunityRepresentationName) return opportunityRepresentationName;

    const path = API_ROUTES.opportunityRepresentationName;
    opportunityRepresentationName = (await httpGet({
      path,
      module: Module.Marvin,
      callerSource
    })) as IOppRepresentationName;

    persistOppRepName(opportunityRepresentationName);

    return opportunityRepresentationName;
  } catch (ex) {
    trackError(ex);
    return {
      OpportunityRepresentationSingularName: 'Opportunity',
      OpportunityRepresentationPluralName: 'Opportunities'
    };
  }
};

export { getOpportunityRepresentationName };
