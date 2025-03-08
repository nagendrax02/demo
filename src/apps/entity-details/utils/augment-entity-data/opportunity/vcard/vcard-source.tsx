import { IOpportunity } from 'common/types';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { IMetaDataConfig } from '../../../../types';
import { DataType, RenderType } from 'common/types/entity/lead';
import styles from './vcard-config.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { OPP_INTERNAL_SCHEMA_NAMES } from '../constants';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';

export const getOpportunitySourceAttributes = (entityData: IOpportunity): IActivityAttribute[] => {
  try {
    const sourceAttributes: IActivityAttribute[] = [];
    const metaData = entityData?.details?.EntityAttribute;
    const fieldData = entityData?.details?.Fields;
    const sourceAttributesInternalSchemaNames = [
      OPP_INTERNAL_SCHEMA_NAMES.opportunitySourceName,
      OPP_INTERNAL_SCHEMA_NAMES.opportunitySourceCampaign,
      OPP_INTERNAL_SCHEMA_NAMES.opportunitySourceMedium,
      OPP_INTERNAL_SCHEMA_NAMES.opportunitySourceTerm,
      OPP_INTERNAL_SCHEMA_NAMES.opportunitySourceContent
    ];

    const internalSchemaMetaDataMap = createHashMapFromArray<IActivityAttribute>(
      Object.values(metaData) || [],
      'InternalSchemaName'
    );

    sourceAttributesInternalSchemaNames?.forEach((sourceItem) => {
      const item = internalSchemaMetaDataMap?.[sourceItem];
      if (item)
        sourceAttributes.push({ ...item, fieldValue: fieldData && fieldData[item?.SchemaName] });
    });

    return sourceAttributes;
  } catch (error) {
    return [];
  }
};

const getOpportunitySourceSecondaryConfig = (
  entityData: IOpportunity,
  fieldConfig: IActivityAttribute
): IMetaDataConfig => {
  const sourceAttributes = getOpportunitySourceAttributes(entityData);

  const getSourceValueElement = (): JSX.Element => {
    if (sourceAttributes?.length) {
      return (
        <div className={styles.value_wrapper}>
          {sourceAttributes?.map((attribute) => {
            return (
              <div className={styles.metadata_wrapper} key={attribute?.fieldValue}>
                <Icon
                  name="fiber_manual_record"
                  customStyleClass={styles.seperator}
                  variant={IconVariant.Filled}
                />
                <div>{`${attribute?.DisplayName}: `}</div>
                <div>{attribute?.fieldValue}</div>
              </div>
            );
          })}
        </div>
      );
    }
    return <></>;
  };

  return {
    SchemaName: fieldConfig?.SchemaName,
    DisplayName: fieldConfig?.DisplayName,
    DataType: DataType.Text,
    RenderType: RenderType.Component,
    Value: '',
    vCardDisplayName: fieldConfig?.DisplayName,
    JSXValue: getSourceValueElement()
  };
};

// const getOpportunitySourcePrimaryConfig = (entityData: IOpportunity): IMetaDataConfig => {}; TEMP

export { getOpportunitySourceSecondaryConfig };
