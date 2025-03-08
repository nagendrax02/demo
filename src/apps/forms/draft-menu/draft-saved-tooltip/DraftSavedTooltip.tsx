import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../drafts-menu.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import { MAX_FORMS_DRAFT_LIMIT } from '../draft-config';

type DraftSavedTooltipProps = {
  draftsCount: number;
};

const DraftSavedTooltip = (props: DraftSavedTooltipProps): JSX.Element => {
  const { draftsCount } = props;
  const showWarning = draftsCount === MAX_FORMS_DRAFT_LIMIT;
  return (
    <div className={styles.draft_tooltip_wrapper}>
      <div className={styles.draft_tooltip_content}>
        <Icon
          customStyleClass={styles.draft_tooltip_icon}
          variant={IconVariant.Filled}
          name="check_circle"
        />
        <span className={styles.draft_tooltip_text}>Draft Saved Successfully</span>
        <span
          className={classNames(
            styles.draft_tooltip_count,
            showWarning ? styles.draft_tooltip_count_warning : ''
          )}>
          ({draftsCount}/{MAX_FORMS_DRAFT_LIMIT})
        </span>
      </div>
      {showWarning ? (
        <div className={styles.draft_tooltip_warning}>
          <div className={styles.draft_tooltip_warning_heading}>Limit reached</div>
          <div>Submit or Delete existing drafts to save more.</div>
        </div>
      ) : (
        <div className={styles.draft_tooltip_sub_heading}>
          You can save up to {MAX_FORMS_DRAFT_LIMIT} drafts
        </div>
      )}
    </div>
  );
};

export default DraftSavedTooltip;
