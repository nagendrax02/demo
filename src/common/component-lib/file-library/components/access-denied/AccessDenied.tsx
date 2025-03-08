import EmptyState from 'common/component-lib/empty-state';
import Icon from '@lsq/nextgen-preact/icon';
import styles from './access-denied.module.css';

const AccessDenied = (): JSX.Element => {
  return (
    <div className={styles.access_denied}>
      <EmptyState
        title="Access Denied"
        icon={<Icon name="do_not_disturb" customStyleClass={styles.icon} />}
        descriptionText="Please contact support@leadsquared.com for any assistance"
      />
    </div>
  );
};

export default AccessDenied;
