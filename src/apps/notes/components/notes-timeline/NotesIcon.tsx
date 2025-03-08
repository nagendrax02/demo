import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './notes-timeline.module.css';

const NotesIcon = (): JSX.Element => {
  return (
    <Icon
      name={'sticky_note_2'}
      variant={IconVariant.Outlined}
      customStyleClass={styles.timeline_icon}
    />
  );
};

export default NotesIcon;
