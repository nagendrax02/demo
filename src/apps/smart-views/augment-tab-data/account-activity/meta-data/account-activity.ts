import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { CallerSource } from 'common/utils/rest-client';
import { ActivityBaseAttributeDataType, RenderType } from 'common/types/entity/lead';
import {
  IActivityAttribute,
  IActivityMetaData
} from 'common/utils/entity-data-manager/activity/activity.types';
import { ConditionEntityType } from 'apps/smart-views/constants/constants';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { getAccountActivityMetaData } from 'common/utils/entity-data-manager/account-activity';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { EntityType } from 'common/types';
import { customActivityFields } from '../helpers';

const getMetaData = (currentMetadata: IActivityAttribute): IAugmentedSmartViewEntityMetadata => {
  const metadata = {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType:
      currentMetadata?.DataType === ActivityBaseAttributeDataType.DateTime
        ? RenderType.Datetime
        : currentMetadata?.RenderType,
    dataType: currentMetadata?.DataType,
    parentField: currentMetadata?.ParentField,
    conditionEntityType: ConditionEntityType.CompanyActivity,
    isSortable: false,
    ShowInForm: currentMetadata?.ShowInForm
  };

  return metadata;
};

const getAugmentedMetaData = (
  activityMetadata: IActivityMetaData
): {
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
} => {
  if (!activityMetadata) {
    return { metaDataMap: {} };
  }

  const augmentedLeadMetadata =
    activityMetadata?.Fields?.reduce(
      (
        allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
        currentMetadata: IActivityAttribute
      ) => {
        allMetadata[currentMetadata?.SchemaName] = getMetaData({
          ...currentMetadata
        });

        return allMetadata;
      },
      {}
    ) || {};

  return {
    metaDataMap: augmentedLeadMetadata
  };
};

export const fetchActivityMetadata = async (
  code: string,
  callerSource = CallerSource.SmartViews
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
}> => {
  const defaultRepName = DEFAULT_ENTITY_REP_NAMES[EntityType.AccountActivity];
  try {
    const metaData: IActivityMetaData =
      (await getAccountActivityMetaData(parseInt(code, 10), callerSource)) || {};

    const { metaDataMap: activityMetaData } = getAugmentedMetaData(metaData);

    const config = {
      ...activityMetaData,
      ...customActivityFields()
    };

    // Deleting CreatedOn as CreatedOn filter and Activity Date are same
    delete config.CreatedOn;

    return {
      metaDataMap: config as Record<string, IAugmentedSmartViewEntityMetadata>,
      representationName: {
        SingularName: metaData.DisplayName || defaultRepName.SingularName,
        PluralName: metaData.PluralName || defaultRepName.PluralName
      }
    };
  } catch (error) {
    trackError(error);
  }
  return {
    metaDataMap: {},
    representationName: defaultRepName
  };
};
