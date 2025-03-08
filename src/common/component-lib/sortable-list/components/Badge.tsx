import BadgeComponent from '@lsq/nextgen-preact/v2/badge';
import styles from '../sortable-list.module.css';
import { classNames } from 'common/utils/helpers/helpers';

const Badge = ({ badgeText }: { badgeText?: string }): JSX.Element | null => {
  if (badgeText) {
    return (
      <BadgeComponent size="sm" type="regular" status="neutral">
        <div
          className={classNames(styles.badge_text, 'ng_v2_style', 'ng_p_2_sb')}
          title={badgeText}>
          {badgeText}
        </div>
      </BadgeComponent>
    );
  }
  return null;
};

export default Badge;
