import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { CallerSource } from 'common/utils/rest-client';
import { ActivityBaseAttributeDataType, RenderType } from 'common/types/entity/lead';
import activityDataManager from 'common/utils/entity-data-manager/activity';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { customFormedActivityMetadata } from '../helpers';
import { REDUNDANT_SCHEMAS, SALES_ACTIVITY_TAB, UPDATE_DISPLAY_NAME } from '../constants';
import { ConditionEntityType } from 'apps/smart-views/constants/constants';
import { safeParseJson } from 'common/utils/helpers';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';

const getCustomObjectMetaData = (
  currentMetadata: IActivityAttribute,
  allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>
): void => {
  if (currentMetadata?.CustomObjectMetaData?.Fields?.length) {
    currentMetadata?.CustomObjectMetaData?.Fields?.forEach((cfsMetaData) => {
      const cfsSchemaName = `${currentMetadata?.SchemaName}~${cfsMetaData?.SchemaName}`;
      allMetadata[cfsSchemaName] = {
        schemaName: cfsSchemaName,
        displayName: `${currentMetadata?.DisplayName} - ${cfsMetaData?.DisplayName}`,
        renderType: (cfsMetaData?.RenderType || cfsMetaData?.DataType) as RenderType,
        cfsDisplayName: cfsMetaData?.DisplayName,
        isCFS: true,
        parentSchemaName: currentMetadata?.SchemaName,
        dataType: cfsMetaData?.DataType,
        parentField: cfsMetaData?.ParentField,
        conditionEntityType: ConditionEntityType.Activity,
        ShowInForm: currentMetadata?.ShowInForm,
        isSortable: false
      };
    });
  }
};

const activityNoteRenderType = (schemaName: string, renderType: string): RenderType => {
  if (schemaName !== 'ActivityEvent_Note') return renderType as RenderType;

  if (!renderType) return RenderType.TextArea;

  return renderType as RenderType;
};

const getMetaData = (currentMetadata: IActivityAttribute): IAugmentedSmartViewEntityMetadata => {
  const metadata = {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType:
      currentMetadata?.DataType === ActivityBaseAttributeDataType.DateTime
        ? RenderType.Datetime
        : activityNoteRenderType(currentMetadata?.SchemaName, currentMetadata?.RenderType),
    dataType: currentMetadata?.DataType,
    parentField: currentMetadata?.ParentField,
    conditionEntityType: ConditionEntityType.Activity,
    isSortable: false,
    ShowInForm: currentMetadata?.ShowInForm,
    IsMultiSelectDropdown: currentMetadata?.IsMultiSelectDropdown
  };

  return metadata;
};

// eslint-disable-next-line max-lines-per-function
const getAugmentedSmartViewsActivityMetaData = (
  activityMetadata: Record<string, IActivityAttribute>,
  entityCode: string
): {
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  isOwnerIdNotPresent?: boolean;
  isActivityNoteNotPresent?: boolean;
  statusNotPresent?: boolean;
} => {
  if (!activityMetadata) {
    return { metaDataMap: {} };
  }

  let isOwnerIdNotPresent = true;
  let isActivityNoteNotPresent = true;
  let statusNotPresent = true;

  const augmentedLeadMetadata = Object.values(activityMetadata)?.reduce(
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadata: IActivityAttribute
    ) => {
      if (currentMetadata?.SchemaName === 'Owner') isOwnerIdNotPresent = false;
      if (currentMetadata?.SchemaName === 'Status') statusNotPresent = false;
      if (currentMetadata?.SchemaName === 'ActivityEvent_Note') isActivityNoteNotPresent = false;
      if (currentMetadata?.DataType === ActivityBaseAttributeDataType.Product) {
        currentMetadata.RenderType = RenderType.Product;
      }

      const displayName =
        (UPDATE_DISPLAY_NAME[currentMetadata?.DisplayName] as string) ||
        currentMetadata?.DisplayName;

      if (currentMetadata?.DataType === ActivityBaseAttributeDataType.CustomObject) {
        getCustomObjectMetaData(currentMetadata, allMetadata);
        return allMetadata;
      } else if (REDUNDANT_SCHEMAS[entityCode.toString()]?.includes(currentMetadata.SchemaName)) {
        return allMetadata;
      }
      allMetadata[currentMetadata?.SchemaName] = getMetaData({
        ...currentMetadata,
        DisplayName: displayName
      });

      return allMetadata;
    },
    {}
  );
  if (SALES_ACTIVITY_TAB[entityCode]) {
    isOwnerIdNotPresent = false;
  }
  return {
    metaDataMap: augmentedLeadMetadata,
    isActivityNoteNotPresent,
    isOwnerIdNotPresent,
    statusNotPresent
  };
};

export const fetchSmartViewActivityMetadata = async (
  code: string,
  callerSource: CallerSource
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
}> => {
  try {
    const metaDataMap: Record<string, IActivityAttribute> =
      (await activityDataManager.fetchMetaData(parseInt(code, 10), callerSource))?.metaDataMap ||
      {};

    const {
      metaDataMap: activityMetaData,
      isActivityNoteNotPresent,
      isOwnerIdNotPresent,
      statusNotPresent
    } = getAugmentedSmartViewsActivityMetaData(metaDataMap, code);

    const config = safeParseJson(
      JSON.stringify({
        metaDataMap: {
          ...activityMetaData,
          ...customFormedActivityMetadata({
            code,
            isActivityNoteNotPresent,
            isOwnerIdNotPresent,
            statusNotPresent
          })
        }
      })
    );
    return config as {
      metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
    };
  } catch (error) {
    trackError(error);
  }
  return { metaDataMap: {} };
};
