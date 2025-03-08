import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunity } from 'common/types';
import { IOppVCardConfiguration } from 'common/types/entity/opportunity/detail.types';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { getLeadName } from '../utils';
import { IMetaDataConfig } from '../../../../types';
import { DataType, RenderType } from 'common/types/entity/lead';
import styles from './vcard-config.module.css';

interface ISectionBasedConfig {
  primary: IActivityAttribute[];
  secondary: IActivityAttribute[];
}

export const getOpportunityFields = (
  opportunityVCardConfig: IOppVCardConfiguration[] | undefined,
  entityAttribute: Record<string, IActivityAttribute>
): IActivityAttribute[] | null => {
  try {
    if (opportunityVCardConfig) {
      const vCardFields = (opportunityVCardConfig && opportunityVCardConfig?.[0]?.Fields) || [];
      const auditFields = (opportunityVCardConfig && opportunityVCardConfig[1]?.Fields) || [];
      const opportunityFields = [...vCardFields, ...auditFields];
      const fieldsWithAttributes = opportunityFields?.map((field) => {
        return entityAttribute?.[field && field?.SchemaName];
      });

      return fieldsWithAttributes as IActivityAttribute[];
    }
    return [];
  } catch (error) {
    trackError(error);
    return null;
  }
};

const getSectionBasedConfig = (entityData: IOpportunity): ISectionBasedConfig => {
  let sectionData: ISectionBasedConfig = { primary: [], secondary: [] };
  let vCardFields = getOpportunityFields(
    entityData?.details?.VCardConfiguration,
    entityData?.details?.EntityAttribute
  );

  if (vCardFields) {
    let fieldCount = 2;
    if (entityData?.details?.EntityDetailsViewId) {
      fieldCount = entityData?.details?.VCardConfiguration?.[0]?.Fields?.length || 2;
    }
    vCardFields = vCardFields.slice(0, fieldCount);
    const primaryRowFields = [vCardFields?.[0]];

    const secondaryRowFields = vCardFields?.slice(1);
    sectionData = { ...sectionData, primary: primaryRowFields, secondary: secondaryRowFields };
  }

  return sectionData;
};

const getAssociatedLeadField = (entityData: IOpportunity): IMetaDataConfig => {
  const leadFields = entityData?.details?.AssociatedLeadData?.details?.Fields;
  const leadId = entityData?.details?.RelatedProspectId;

  return {
    SchemaName: '',
    DisplayName: getLeadName(leadFields),
    DataType: DataType.Lead,
    RenderType: RenderType.Lead,
    Value: leadId || '',
    valueCustomStyleClass: styles.associated_lead_icon
  };
};
export { getSectionBasedConfig, getAssociatedLeadField };
