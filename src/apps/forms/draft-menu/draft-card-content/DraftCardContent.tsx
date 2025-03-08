import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { classNames } from 'common/utils/helpers/helpers';
import { IDraft, IDraftCardContentProps } from '../draft-config';
import styles from '../drafts-menu.module.css';
import OpportunityIcon from 'apps/activity-history/components/shared/opportunity-icon';
import { convertEpochToDateString } from '@lsq/nextgen-preact/date/utils';

const DraftEntityIcon = (props: { draft: IDraft }): JSX.Element => {
  const { draft } = props;
  const isEntityPresent = draft?.leadId ?? (draft?.opportunityId && draft?.opportunityCode);

  if (draft?.opportunityId && draft?.opportunityCode) {
    return (
      <OpportunityIcon
        className={classNames(
          styles.draft_body_card_lead_icon,
          isEntityPresent ? styles.draft_body_card_opp_present : styles.draft_body_card_opp_absent
        )}
      />
    );
  }

  return (
    <Icon
      customStyleClass={styles.draft_body_card_lead_icon}
      name="person"
      variant={IconVariant.Outlined}
    />
  );
};

const DraftCardContent = (props: IDraftCardContentProps): JSX.Element => {
  const { draft, children, onClick, onEntityClick } = props;
  const isEntityPresent = draft?.leadId ?? (draft?.opportunityId && draft?.opportunityCode);

  return (
    <button onClick={onClick} className={styles.draft_body_card_top_wrapper}>
      <div className={styles.draft_body_card_top}>
        <div className={styles.draft_body_card_name}>{draft.formName}</div>
        {children}
      </div>
      <div className={styles.draft_body_card_top}>
        <button
          className={classNames(
            styles.draft_body_card_lead,
            styles.unset_button,
            isEntityPresent
              ? styles.draft_body_card_lead_present
              : styles.draft_body_card_lead_absent
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (onEntityClick) onEntityClick();
          }}>
          <DraftEntityIcon draft={draft} />
          <span className={styles.draft_body_card_lead_name}>
            {draft.displayName ? draft.displayName : 'No Lead'}
          </span>
        </button>
        {draft.createdOn ? (
          <div className={styles.draft_body_card_date}>
            {convertEpochToDateString(Number(draft.createdOn))}
          </div>
        ) : null}
      </div>
    </button>
  );
};

DraftCardContent.defaultProps = {
  children: null,
  onClick: (): void => {},
  onEntityClick: (): void => {}
};

export default DraftCardContent;
