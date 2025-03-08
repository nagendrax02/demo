import Icon from '@lsq/nextgen-preact/icon';
import { IDraft } from '../draft-config';
import styles from '../drafts-menu.module.css';

const DraftsEmptyState = (props: { drafts: IDraft[]; children: React.ReactNode }): JSX.Element => {
  const { drafts, children } = props;

  if (drafts.length > 0) {
    return <>{children}</>;
  }

  return (
    <div className={styles.draft_body_empty}>
      <Icon customStyleClass={styles.draft_body_empty_icon} name="description" />
      <div className={styles.draft_body_empty_text}>No drafts saved</div>
    </div>
  );
};

export default DraftsEmptyState;
