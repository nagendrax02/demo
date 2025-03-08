import { classNames } from 'src/common/utils/helpers/helpers';
import styles from './empty-states.module.css';
import { IEmptyStateProps } from '../../global-searchV2.types';
import { EMPTY_STATE_CONFIG } from '../../constants';

const EmptyStates: React.FC<IEmptyStateProps> = ({ type }: IEmptyStateProps) => {
  const { Icon, heading, subHeading, additionalComponent } = EMPTY_STATE_CONFIG[type];

  return (
    <div className={styles.empty_state_container}>
      <Icon />
      <h1 className={classNames(styles.empty_state_heading, 'ng_h_3_b')}>{heading}</h1>
      <p className={classNames(styles.empty_state_subheading, 'ng_p_1_sb')}>{subHeading}</p>
      {additionalComponent ? (
        <div className={styles.additionalComponent}>{additionalComponent}</div>
      ) : null}
    </div>
  );
};

export default EmptyStates;
