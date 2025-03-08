import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IEmptyState } from './empty-state.types';
import styles from './empty-state.module.css';

const EmptyState = ({ title, descriptionText, icon, name }: IEmptyState): JSX.Element => {
  return (
    <div className={styles.empty_state_wrapper}>
      <div className={styles.icon_wrapper}>
        {icon ? (
          icon
        ) : (
          <Icon
            name={name ? name : 'description'}
            customStyleClass={styles.icon}
            variant={IconVariant.TwoTone}
          />
        )}
      </div>
      <div className={styles.title}>{title}</div>
      {descriptionText ? <div className={styles.description}>{descriptionText}</div> : null}
    </div>
  );
};

export default EmptyState;
