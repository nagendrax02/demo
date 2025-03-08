import { IOpportunity } from 'common/types';
import {
  ILeadDetailsConfiguration,
  IField as ILeadField
} from 'common/types/entity/lead/detail.types';
import { IField as IOppField } from 'common/types/entity/opportunity/detail.types';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { ActivityBaseAttributeDataType } from 'common/types/entity/lead';

const opportunityAdditionalDetails: ILeadField[] = [
  {
    DisplayName: 'Created By',
    ColSpan: '1',
    SchemaName: 'CreatedBy',
    Fields: []
  },
  {
    DisplayName: 'Created On',
    ColSpan: '1',
    SchemaName: 'CreatedOn',
    Fields: []
  },
  {
    DisplayName: 'Modified By',
    ColSpan: '1',
    SchemaName: 'ModifiedBy',
    Fields: []
  },
  {
    DisplayName: 'Modified On',
    ColSpan: '1',
    SchemaName: 'ModifiedOn',
    Fields: []
  }
];

const associatedLead: ILeadField = {
  ColSpan: '1',
  DisplayName: 'Associated Lead',
  SchemaName: 'RelatedLead',
  Fields: []
};

const getAugmentedCFSFields = (oppfieldMetaData: IActivityAttribute): ILeadField[] => {
  if (
    oppfieldMetaData?.DataType === ActivityBaseAttributeDataType.CustomObject &&
    oppfieldMetaData?.CustomObjectMetaData?.Fields?.length
  ) {
    return oppfieldMetaData?.CustomObjectMetaData?.Fields?.map((cfsField): ILeadField => {
      return {
        DisplayName: cfsField?.DisplayName,
        SchemaName: cfsField?.SchemaName,
        ColSpan: cfsField?.ColSpan ? `${cfsField?.ColSpan}` : '1',
        Fields: []
      };
    });
  }
  return [];
};

const getAugmentedFields = (
  oppfields: IOppField[],
  metaDataMap: Record<string, IActivityAttribute>
): ILeadField[] => {
  const leadFields: ILeadField[] = [];

  if (oppfields?.length) {
    oppfields?.forEach((oppfield) => {
      const oppfieldMetaData = metaDataMap?.[oppfield?.SchemaName];
      const displayName = oppfield?.DisplayName || oppfieldMetaData?.DisplayName;
      if (displayName) {
        leadFields?.push({
          DisplayName: displayName,
          SchemaName: oppfield?.SchemaName,
          ColSpan: oppfield?.Colspan,
          Fields: getAugmentedCFSFields(oppfieldMetaData)
        });
      }
    });
  }

  return leadFields;
};

const getDetailsConfiguration = (entityData: IOpportunity): ILeadDetailsConfiguration => {
  const oppDetailsConfigurations = entityData?.details?.OpportunityDetailsConfiguration;

  const oppMetaDataMap = entityData?.metaData?.Fields;

  const config: ILeadDetailsConfiguration = {
    Sections: []
  };

  if (oppDetailsConfigurations.length) {
    oppDetailsConfigurations?.forEach((oppDetailsConfig, index) => {
      const isPrimarySection = index == 0;
      const augmentedFields = getAugmentedFields(oppDetailsConfig?.Fields, oppMetaDataMap || {});
      config?.Sections?.push({
        DisplayName: oppDetailsConfig?.DisplayName,
        Fields: isPrimarySection ? [associatedLead, ...augmentedFields] : augmentedFields,
        DispositionField: '',
        CanModify: !entityData?.details?.CanDelete
      });
    });
  }

  config?.Sections?.push({
    DisplayName: 'Additional Details',
    Fields: opportunityAdditionalDetails,
    DispositionField: ''
  });

  return config;
};

export { getDetailsConfiguration };
