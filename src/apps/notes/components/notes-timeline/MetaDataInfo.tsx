import { INotesItem } from '../../notes.types';
import styles from './notes-timeline.module.css';

interface IMetaDataInfo {
  notesItem: INotesItem;
}

const MetaDataInfo = (props: IMetaDataInfo): JSX.Element => {
  const { notesItem } = props;

  return notesItem?.CreatedByName ? (
    <div data-testid="note-created-by" className={styles.notes_metadata_info}>
      Added by <span>{notesItem?.CreatedByName}</span>
    </div>
  ) : (
    <></>
  );
};

export default MetaDataInfo;
