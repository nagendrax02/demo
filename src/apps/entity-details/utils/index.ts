import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { Module } from 'common/component-lib/mip-header';
import { IAugmentedEntity, IMetaDataConfig, IMetricsConfig } from '../types';
import augmentEntityData from './augment-entity-data';
import { EntityType, IAccount, IEntity, ILead, IOpportunity } from 'common/types';
import { setMiPHeaderModule } from 'common/component-lib/mip-header';
import { isMiP } from 'common/utils/helpers';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { IEntityRepresentationConfig } from '../types/entity-store.types';
import { DEFAULT_REPRESENTATION_NAME } from '../constants';
import { IAssociatedEntityDetails, IEntityRepresentationName } from '../types/entity-data.types';
import { IOppRepresentationName } from 'common/types/entity/opportunity/detail.types';
import { getPersistedAuthConfig } from 'common/utils/authentication';

const handlePhoneNumberClick = async (
  fieldValues: Record<string, string | null> | undefined,
  currentField: IMetaDataConfig,
  associatedEntityDetails?: IAssociatedEntityDetails
): Promise<void> => {
  try {
    const module = await import('apps/external-app');
    module.triggerEntityClick2Call({
      fields: fieldValues,
      phoneNumber: currentField?.Value,
      schemaName: currentField.SchemaName,
      associatedEntityDetails
    });
  } catch (error) {
    trackError(error);
  }
};

const getLeadName = (fieldValues: Record<string, string | null> | undefined): string => {
  const leadName = `${fieldValues?.FirstName || ''} ${fieldValues?.LastName || ''}`?.trim();

  if (leadName) return leadName;

  if (fieldValues?.RelatedEntityIdName) return fieldValues.RelatedEntityIdName;

  return (
    fieldValues?.EmailAddress ||
    fieldValues?.P_EmailAddress ||
    fieldValues?.Mobile ||
    fieldValues?.Phone ||
    ''
  );
};

const getAccountName = (fieldValues: Record<string, string | null> | undefined): string => {
  return (
    fieldValues?.CompanyName ||
    fieldValues?.EmailAddress ||
    fieldValues?.P_EmailAddress ||
    fieldValues?.Mobile ||
    fieldValues?.Phone ||
    ''
  );
};

const updateMipHeaderModule = (type: EntityType): void => {
  if (isMiP()) {
    switch (type) {
      case EntityType.Lead:
        setMiPHeaderModule(Module.LeadDetails);
        break;
      case EntityType.Opportunity:
        setMiPHeaderModule(Module.OpportunityDetails);
        break;
      case EntityType.Account:
        setMiPHeaderModule(Module.AccountDetails);
        break;
    }
  }
};

const getTruncatedString = (str: string): string => {
  if (str.length >= 150) {
    return str.substring(0, 150) + '...';
  } else {
    return str;
  }
};

interface IGetStyle {
  entityProperties: IEntityProperty[] | undefined;
  augmentedEntityMetric: IMetricsConfig[] | undefined;
  isLoading: boolean;
}

const getStyle = (props: IGetStyle): boolean => {
  const { entityProperties, augmentedEntityMetric, isLoading } = props;
  if (!isLoading && !entityProperties?.length && !augmentedEntityMetric?.length) {
    return true;
  }
  return false;
};

const getUserId = (): string => {
  const authData = getPersistedAuthConfig();
  return authData?.User?.Id || '';
};

const getAugmentedOppRepresentationName = (
  oppRepName: IOppRepresentationName
): IEntityRepresentationName => {
  return {
    SingularName: oppRepName.Singular,
    PluralName: oppRepName.Plural
  };
};

const getRepresentationName = (
  entity: EntityType,
  response: IEntity
): IEntityRepresentationConfig => {
  switch (entity) {
    case EntityType.Lead:
      return {
        ...DEFAULT_REPRESENTATION_NAME,
        [EntityType.Lead]:
          (response as ILead).metaData.LeadRepresentationConfig || DEFAULT_REPRESENTATION_NAME.lead
      };
    case EntityType.Opportunity:
      return {
        ...DEFAULT_REPRESENTATION_NAME,
        [EntityType.Lead]:
          (response as IOpportunity).details.LeadRepresentationName ||
          DEFAULT_REPRESENTATION_NAME.lead,
        [EntityType.Opportunity]:
          getAugmentedOppRepresentationName(
            (response as IOpportunity).details.OppRepresentationName
          ) || DEFAULT_REPRESENTATION_NAME.opportunity
      };
    case EntityType.Account:
      return {
        ...DEFAULT_REPRESENTATION_NAME,
        [EntityType.Lead]:
          (response as IAccount)?.metaData?.LeadRepresentationConfig ||
          DEFAULT_REPRESENTATION_NAME.lead,
        [EntityType.Account]:
          (response as IAccount)?.metaData?.AccountRepresentationConfig ||
          DEFAULT_REPRESENTATION_NAME.account
      };
  }
  return DEFAULT_REPRESENTATION_NAME;
};

const canRenderAssociatedProperty = (augmentedEntityData: IAugmentedEntity | null): boolean => {
  return !!(
    augmentedEntityData?.associatedLeadProperties &&
    augmentedEntityData?.attributes?.fields?.PC_ProspectID
  );
};
export {
  getStyle,
  getUserId,
  getLeadName,
  getAccountName,
  augmentEntityData,
  getTruncatedString,
  getRepresentationName,
  updateMipHeaderModule,
  handlePhoneNumberClick,
  canRenderAssociatedProperty
};
