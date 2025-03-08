import styles from '../vcard-config.module.css';
import { IList } from 'common/types/entity/list/list.types';
import DateInfo from './DateInfo';

const ModifiedAndCreatedOn = ({ entityData }: { entityData: IList }): JSX.Element => {
  const { ModifiedOn, ModifiedByName, CreatedOn, CreatedByName } = entityData.details;
  return (
    <div className={styles.list_creation_info_container}>
      <DateInfo label="Modified On" date={ModifiedOn} user={ModifiedByName} timeFormat="hh:mm a" />
      <DateInfo label="Created On" date={CreatedOn} user={CreatedByName} timeFormat="hh:mm a" />
    </div>
  );
};

export default ModifiedAndCreatedOn;
