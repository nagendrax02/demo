import { OPP_SOURCE_SCHEMA_NAMES } from './constants';
import styles from './opportunity-source.module.css';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { safeParseJson } from 'common/utils/helpers';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';

export interface IOpportunitySource {
  sourceDataString: string;
}

const OpportunitySource = ({ sourceDataString }: IOpportunitySource): JSX.Element => {
  const parsedData = safeParseJson(sourceDataString) as IActivityAttribute[];

  const internalSchemaMetaDataMap = createHashMapFromArray<IActivityAttribute>(
    Object.values(parsedData) || [],
    'InternalSchemaName'
  );

  const getSourceContent = (): JSX.Element[] => {
    return OPP_SOURCE_SCHEMA_NAMES.map((schemaName) => {
      const field = internalSchemaMetaDataMap?.[schemaName];
      const fieldName = schemaName === 'OpportunitySourceName' ? 'Name' : field?.DisplayName;
      return (
        <div className={styles.field} key={schemaName}>
          <div className={styles.name}>{fieldName}:</div>
          <div className={styles.value}>
            <span>{field?.fieldValue}</span>
          </div>
        </div>
      );
    });
  };
  return <div className={styles.wrapper}>{getSourceContent()}</div>;
};

export default OpportunitySource;
