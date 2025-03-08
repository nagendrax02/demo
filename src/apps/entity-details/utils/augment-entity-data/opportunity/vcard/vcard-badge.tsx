import { trackError } from 'common/utils/experience/utils/track-error';
import { IOpportunity } from 'common/types';
import { IBadgeConfig } from '../../../../types';
import { OPP_STAGE_SCHEMA_NAMES } from '../constants';
import { createHashMapFromArray, isDarkMode } from 'common/utils/helpers/helpers';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import styles from './vcard-config.module.css';

export const getOppStatusData = (entityData: IOpportunity): Record<string, IActivityAttribute> => {
  const metaData = entityData?.details?.EntityAttribute;
  const fieldData = entityData?.details?.Fields;
  const oppStatusData: Record<string, IActivityAttribute> = {};

  const internalSchemaMetaDataMap = createHashMapFromArray<IActivityAttribute>(
    Object.values(metaData) || [],
    'InternalSchemaName'
  );

  OPP_STAGE_SCHEMA_NAMES.forEach((schemaName) => {
    const field = internalSchemaMetaDataMap?.[schemaName];
    if (field && field?.InternalSchemaName) {
      oppStatusData[field?.InternalSchemaName] = {
        ...field,
        fieldValue: fieldData?.[field?.SchemaName]
      };
    }
  });

  return oppStatusData;
};

const getOppBadgeContent = (statusData: Record<string, IActivityAttribute>): string => {
  let text = '';
  if (statusData?.OpportunityStatus) {
    text += `${statusData?.OpportunityStatus?.fieldValue} `;
  }

  if (statusData?.OpportunityReason && !statusData?.OpportunityStatus) {
    text += `${statusData?.OpportunityReason?.fieldValue}`;
  }

  if (statusData?.OpportunityReason) {
    text += `- ${statusData?.OpportunityReason?.fieldValue}`;
  }
  return text;
};

const getOppBadgeTooltipContent = (statusData: Record<string, IActivityAttribute>): JSX.Element => {
  return (
    <div className={styles.badge_tooltip_wrapper}>
      {Object.keys(statusData)?.map((item, i) => {
        const key = i;
        return (
          <div key={key} className={styles.badge_tooltip_field}>
            <div
              className={
                styles.badge_tooltip_field_name
              }>{`${statusData?.[item]?.DisplayName}:`}</div>
            <div className={styles.badge_tooltip_field_value}>{statusData?.[item]?.fieldValue}</div>
          </div>
        );
      })}
    </div>
  );
};

const getBadgeColor = (statusData: Record<string, IActivityAttribute>): string => {
  const statusValue = statusData?.OpportunityStatus?.fieldValue;

  switch (statusValue) {
    case 'Won':
      return isDarkMode() ? styles.badge_won_color_dark : styles.badge_won_color;
    case 'Lost':
      return isDarkMode() ? styles.badge_lost_color_dark : styles.badge_lost_color;
    default:
      return isDarkMode() ? styles.badge_default_color_dark : styles.badge_default_color;
  }
};

const getBadgeConfig = (entityData: IOpportunity): IBadgeConfig => {
  try {
    const statusData = getOppStatusData(entityData);

    return {
      content: getOppBadgeContent(statusData) || '',
      tooltipContent: getOppBadgeTooltipContent(statusData),
      className: `${styles.badge} ${getBadgeColor(statusData)}`
    };
  } catch (error) {
    trackError(error);
  }
  return { content: '' };
};

export { getBadgeConfig };
