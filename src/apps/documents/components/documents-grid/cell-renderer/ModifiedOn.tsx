import { IDocument } from '../../../documents.types';
import styles from '../../../documents.module.css';
import { getFormattedDateTime } from 'common/utils/date';

const ModifiedOn = ({ record }: { record: IDocument }): JSX.Element => {
  return (
    <>
      <div className={styles.modified_on} data-testid={`modified-on-${record.Id}`}>
        {getFormattedDateTime({ date: record.ModifiedOn, timeFormat: 'hh:mm a' })}
      </div>
    </>
  );
};

export default ModifiedOn;
