import { ILeadMetadataMap } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { fetchLeadTypeConfig } from './settings';
import {
  fetchMetadataOfNonLeadType,
  fetchRepNameOfNonLeadType
} from 'common/utils/entity-data-manager/lead/metadata';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';

const getLeadTypeFields = async (
  leadType: string,
  callerSource: CallerSource
): Promise<Record<string, boolean>> => {
  const leadTypeConfig = await fetchLeadTypeConfig(callerSource);

  const leadFields = leadType.split(',')?.reduce((acc: string[], currLeadType) => {
    // adding || null works against evaluating to `['']` when split is executed on empty string
    return acc.concat(
      (leadTypeConfig?.[currLeadType]?.FieldConfiguration || null)?.split(', ') ?? []
    );
  }, []);

  return leadFields.reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});
};

const fetchMetadataOfLeadType = async (
  leadType: string,
  callerSource: CallerSource
): Promise<ILeadMetadataMap> => {
  const [leadTypeFields, metadataMap] = await Promise.all([
    getLeadTypeFields(leadType, callerSource),
    fetchMetadataOfNonLeadType(callerSource)
  ]);
  let filteredMetadata = {};

  // If length of leadTypeFields is 0, it means it is default lead type. So, no filtering is required.
  if (!Object.keys(leadTypeFields).length) {
    filteredMetadata = metadataMap;
  } else {
    Object.keys(leadTypeFields).forEach((schemaName) => {
      if (metadataMap[schemaName]) {
        filteredMetadata[schemaName] = metadataMap[schemaName];
      }
    });
  }

  return filteredMetadata;
};

const fetchRepNameOfLeadType = async (
  leadType: string,
  callerSource: CallerSource
): Promise<IEntityRepresentationName> => {
  /* Currently not showing leadType name anywhere till platform supports it. So, commenting out below code */
  // if (leadType?.split(',').length > 1) {
  //   const repName = await fetchRepNameOfNonLeadType(callerSource);
  //   return {
  //     SingularName: repName?.SingularName ?? DEFAULT_ENTITY_REP_NAMES.lead.SingularName,
  //     PluralName: repName?.PluralName ?? DEFAULT_ENTITY_REP_NAMES.lead.PluralName
  //   };
  // }

  // const leadTypeConfig = (await fetchLeadTypeConfig(callerSource))?.[leadType];

  // return {
  //   SingularName: leadTypeConfig?.Name ?? DEFAULT_ENTITY_REP_NAMES.lead.SingularName,
  //   PluralName: leadTypeConfig?.PluralName ?? DEFAULT_ENTITY_REP_NAMES.lead.PluralName
  // };

  const repName = await fetchRepNameOfNonLeadType(callerSource);
  return {
    SingularName: repName?.SingularName ?? DEFAULT_ENTITY_REP_NAMES.lead.SingularName,
    PluralName: repName?.PluralName ?? DEFAULT_ENTITY_REP_NAMES.lead.PluralName
  };
};

export { fetchMetadataOfLeadType, fetchRepNameOfLeadType };
