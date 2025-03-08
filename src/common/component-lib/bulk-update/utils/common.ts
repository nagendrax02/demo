import { trackError } from 'common/utils/experience/utils/track-error';
import { ICustomObjectMetaData, ILOSProperties } from 'common/types/entity/lead';
import {
  AugmentedRenderType,
  IBulkUpdateField,
  IMetaDataField,
  IMetaDataGet
} from '../bulk-update.types';
import { EntityType } from 'common/types';
import { IBulkConfigCache, IBulkUpdateConfig } from '../bulk-update.types';
import { CallerSource } from 'common/utils/rest-client';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { EXCEPTION_MESSAGE, FIELD_SEPARATOR } from 'common/constants';
import { BULK_UPDATE_HELPER, PERMISSION_ENTITY_TYPE } from '../constant';
import { getAugmentedRenderer } from './render-type-augmenter';
import { sortDropdownOption } from 'common/utils/helpers/helpers';
import { setBulkUpdateConfig } from '../bulk-update.store';
import { getRestrictedData } from 'common/utils/permission-manager';
import { AccessType, ActionType, IEntityPermissionAccess } from 'common/utils/permission-manager';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

const canShowCommentBox = (field: IMetaDataField, renderType: AugmentedRenderType): boolean => {
  return field?.SchemaName === 'DoNotTrack' && renderType === AugmentedRenderType.Checkbox;
};

// eslint-disable-next-line complexity
const getMaxLength = ({
  entityType,
  isCFS,
  renderType,
  defaultMaxLength
}: {
  entityType: EntityType;
  renderType: AugmentedRenderType;
  isCFS: boolean;
  defaultMaxLength: number;
}): number => {
  if (renderType === AugmentedRenderType?.TextBox) {
    return entityType === EntityType?.Lead && isCFS ? 200 : defaultMaxLength || 200;
  }

  if ([AugmentedRenderType?.TextArea, AugmentedRenderType.Editor]?.includes(renderType)) {
    return entityType !== EntityType?.Lead ? 8000 : defaultMaxLength || 2000;
  }

  return defaultMaxLength || 200;
};

const canIncludeOtherOption = (losProperties?: ILOSProperties): boolean => {
  return !!losProperties?.IncludeOthersOption || !!losProperties?.IncludeOthers;
};
export const getAugmentedCustomFields = ({
  customFields,
  entityType,
  parentDisplayName
}: {
  customFields: ICustomObjectMetaData;
  parentDisplayName: string;
  entityType: EntityType;
}): IBulkUpdateField[] => {
  const redundantCFSDataType = new Set(['File', 'Lead']);
  return (
    customFields?.Fields?.reduce((acc: IBulkUpdateField[], field) => {
      if (field?.ParentField || redundantCFSDataType?.has(field?.DataType)) return acc;

      const renderType = getAugmentedRenderer(field as IMetaDataField, true);
      const schemaName = `${field.SchemaName}${FIELD_SEPARATOR}${field.CustomObjectSchemaName}`;
      acc.push({
        label: `${parentDisplayName} - ${field.DisplayName}`,
        value: schemaName,
        entityType,
        augmentedRenderType: renderType,
        isMandatory: field?.IsMandatory,
        maxLength: getMaxLength({
          entityType,
          renderType,
          isCFS: true,
          defaultMaxLength: Number(field?.RangeMax) || Number(field?.MaxLength)
        }),

        schemaName: schemaName,
        scale: field?.Scale,
        showCommentBox: canShowCommentBox(field as IMetaDataField, renderType),
        includeLOSOtherOption: canIncludeOtherOption(field?.LOSProperties),
        renderType: field?.RenderType,
        isCFS: true
      });

      return acc;
    }, []) || []
  );
};

export const createAugmentedField = (
  field: IMetaDataField,
  entityType: EntityType
): IBulkUpdateField => {
  const renderType = getAugmentedRenderer(field, false);
  return {
    label: field?.DisplayName,
    value: field?.SchemaName,
    entityType,
    augmentedRenderType: renderType,
    schemaName: field?.SchemaName,
    isMandatory: field?.IsMandatory,
    maxLength: getMaxLength({
      entityType,
      renderType,
      isCFS: false,
      defaultMaxLength: Number(field?.RangeMax) || Number(field?.MaxLength)
    }),
    showCommentBox: canShowCommentBox(field, renderType),
    scale: field?.Scale,
    includeLOSOtherOption: canIncludeOtherOption(field?.LOSProperties),
    renderType: field?.RenderType,
    isCFS: false,
    internalSchemaName: field?.InternalSchemaName
  };
};

const getCacheKey = (entityType: EntityType, eventCode?: string): string => {
  if (!eventCode) return entityType;
  return `${entityType}-${eventCode}`;
};

const getBulkUpdateConfig = async (
  entityType: EntityType,
  callerSource: CallerSource,
  eventCode?: string
): Promise<IBulkUpdateConfig | null> => {
  try {
    const cacheKey = getCacheKey(entityType, eventCode);
    const cachedData = getItem(StorageKey.BulkUpdate) as IBulkConfigCache;

    if (cachedData?.[cacheKey]) return cachedData[cacheKey];

    const response: IBulkUpdateConfig = await BULK_UPDATE_HELPER?.[entityType].bulkUpdateConfigGet({
      callerSource,
      eventCode: Number(eventCode)
    });

    setItem(StorageKey.BulkUpdate, {
      ...(cachedData || {}),
      [cacheKey]: response
    });
    return response;
  } catch (error) {
    showNotification({
      type: Type.ERROR,
      message: (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE
    });
    trackError(error);
  }
  return null;
};

const getMetaData = async (
  entityType: EntityType,
  eventCode?: string,
  leadTypeConfiguration?: ILeadTypeConfiguration[]
): Promise<IMetaDataGet | null> => {
  try {
    const metaData = await BULK_UPDATE_HELPER?.[entityType]?.metaDataGet?.(
      Number(eventCode),
      leadTypeConfiguration
    );
    return metaData;
  } catch (error) {
    showNotification({
      type: Type.ERROR,
      message: (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE
    });
    trackError(error);
  }
  return null;
};

const getAugmentedBulkConfig = <T>({
  bulkConfig,
  entityType,
  fields,
  restrictionData
}: {
  fields: (T & IMetaDataField)[];
  bulkConfig: IBulkUpdateConfig;
  entityType: EntityType;
  restrictionData: IEntityPermissionAccess;
}): IBulkUpdateField[] => {
  const allowedSchemaSet = new Set(bulkConfig?.SchemaNames || []);

  return fields?.reduce((acc: IBulkUpdateField[], field) => {
    if (!allowedSchemaSet?.has(field?.SchemaName)) {
      return acc;
    }

    if (
      restrictionData?.accessType === AccessType.PartialAccess &&
      restrictionData?.RestrictedFields?.[field?.SchemaName]
    ) {
      return acc;
    }

    const augmentedField = BULK_UPDATE_HELPER?.[entityType]?.augmenter?.(
      field
    ) as IBulkUpdateField[];

    acc = [...acc, ...augmentedField];
    return acc;
  }, []);
};

// eslint-disable-next-line max-lines-per-function, complexity
export const getConfig = async ({
  eventCode,
  callerSource,
  entityType,
  leadTypeConfiguration
}: {
  entityType: EntityType;
  callerSource: CallerSource;
  eventCode?: string;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
}): Promise<void> => {
  try {
    const [bulkUpdateConfig, metaDataFields, restrictionData] = await Promise.all([
      getBulkUpdateConfig(entityType, callerSource, eventCode),
      getMetaData(entityType, eventCode, leadTypeConfiguration),
      getRestrictedData({
        entityType: PERMISSION_ENTITY_TYPE[entityType],
        actionType: ActionType.Update,
        callerSource: CallerSource?.BulkUpdate,
        entityId: eventCode
      })
    ]);

    if (
      !bulkUpdateConfig ||
      !metaDataFields?.metaDataMap?.length ||
      restrictionData?.accessType === AccessType.NoAccess
    )
      return;

    const augmentedFields = getAugmentedBulkConfig({
      fields: metaDataFields?.metaDataMap,
      bulkConfig: bulkUpdateConfig,
      entityType,
      restrictionData
    });

    setBulkUpdateConfig(
      {
        fields: BULK_UPDATE_HELPER?.[entityType]?.canSortFields
          ? sortDropdownOption(augmentedFields)
          : augmentedFields,
        settings: {
          ...(bulkUpdateConfig?.Configs || {}),
          ...(BULK_UPDATE_HELPER?.[entityType]?.settingConfigGet(bulkUpdateConfig?.Configs) || {})
        }
      },
      metaDataFields.repName
    );
  } catch (error) {
    trackError(error);
  }
};

const getTwoDigitDate = (data: number): string => {
  if (data <= 9) return `0${data}`;
  return `${data}`;
};

export const getUtcTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${getTwoDigitDate(date.getUTCHours())}:${getTwoDigitDate(
    date.getUTCMinutes()
  )}:${getTwoDigitDate(date.getUTCSeconds())}`;
};

export const getUTCDateTimeValue = (dateString: string): string => {
  const date = new Date(dateString);
  const utcDate = `${getTwoDigitDate(date.getUTCFullYear())}-${getTwoDigitDate(
    date.getUTCMonth() + 1
  )}-${getTwoDigitDate(date.getUTCDate())}`;

  const utcTime = getUtcTime(dateString);

  return `${utcDate} ${utcTime}`?.trim();
};

export const getCurrentTime = (): string => {
  const date = new Date();
  return `${date?.getHours()}:${date?.getMinutes()}:${date?.getSeconds()}`;
};
