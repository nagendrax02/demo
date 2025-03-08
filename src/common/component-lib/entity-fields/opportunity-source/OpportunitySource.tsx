import { IActivityAttribute } from '../../../utils/entity-data-manager/activity/activity.types';
import { safeParseJson } from '../../../utils/helpers';
import { createHashMapFromArray } from '../../../utils/helpers/helpers';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { OPP_SOURCE_SCHEMA_NAMES } from './constants';
import styles from './opportunity-source.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IOpportunitySource {
  sourceDataString: string;
}

const MAX_CHAR_LIMIT = 150;

const OpportunitySource = ({ sourceDataString }: IOpportunitySource): JSX.Element => {
  const parsedData = safeParseJson(sourceDataString) as IActivityAttribute[];

  const internalSchemaMetaDataMap = createHashMapFromArray<IActivityAttribute>(
    Object.values(parsedData) || [],
    'InternalSchemaName'
  );

  const getAugmentedValue = (value: string): JSX.Element => {
    if (value?.length > MAX_CHAR_LIMIT) {
      return (
        <Tooltip content={value} placement={Placement.Vertical} trigger={[Trigger.Hover]}>
          <span>{`${value.substring(0, MAX_CHAR_LIMIT)}...`}</span>
        </Tooltip>
      );
    }
    return <span>{value}</span>;
  };

  const getSourceContent = (): JSX.Element[] => {
    return OPP_SOURCE_SCHEMA_NAMES.map((schemaName) => {
      const field = internalSchemaMetaDataMap?.[schemaName];
      const fieldName = schemaName === 'OpportunitySourceName' ? 'Name' : field?.DisplayName;
      return (
        <div className={styles.field} key={schemaName}>
          <div className={styles.name}>{fieldName}:</div>
          <div className={styles.value}>{getAugmentedValue(field?.fieldValue || '')}</div>
        </div>
      );
    });
  };
  return <div className={styles.wrapper}>{getSourceContent()}</div>;
};

export default OpportunitySource;
