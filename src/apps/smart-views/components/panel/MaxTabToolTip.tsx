import { classNames } from 'common/utils/helpers/helpers';
import styles from './sv-panel.module.css';

interface IMaxTabToolTipProps {
  maxAllowedTabs: number;
}

const MaxTabToolTip = ({ maxAllowedTabs }: IMaxTabToolTipProps): JSX.Element => {
  return (
    <div className={styles.sv_max_tab_tooltip}>
      <span className={classNames(styles.sv_max_tab_tooltip_text, 'ng_p_1_sb')}>
        {`You have reached the maximum limit of ${maxAllowedTabs} views. Please delete some existing views to create new ones.`}
      </span>
    </div>
  );
};

export default MaxTabToolTip;
