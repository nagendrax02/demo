import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { ILeadDetails, ILeadMetaData } from 'common/types';
import { fetchDetails } from 'common/utils/entity-data-manager/lead/details';
import {
  fetchMetaData,
  fetchRepresentationName
} from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';

const getLeadTypeFromURL = (): string | null => {
  const params = new URLSearchParams(document.location.search);
  const leadType = params.get('leadtype');

  return leadType ?? null;
};

const fetchDataOfLeadType = async (
  callerSource: CallerSource,
  customLeadId?: string
): Promise<[ILeadDetails, ILeadMetaData, IEntityRepresentationName | undefined]> => {
  let leadType = getLeadTypeFromURL();
  if (leadType) {
    return Promise.all([
      fetchDetails(callerSource, customLeadId, leadType),
      fetchMetaData(callerSource, leadType),
      fetchRepresentationName(callerSource, leadType)
    ]);
  }

  const details = await fetchDetails(callerSource, customLeadId);
  leadType = details?.Fields?.LeadType ?? '';
  const [metadata, representationName] = await Promise.all([
    fetchMetaData(callerSource, leadType),
    fetchRepresentationName(callerSource, leadType)
  ]);

  return [details, metadata, representationName];
};

export { getLeadTypeFromURL, fetchDataOfLeadType };
