import { classNames } from 'common/utils/helpers/helpers';
import styles from './sv-panel.module.css';
import { Close } from 'assets/custom-icon/v2';

interface IPanelToggleInfoToolTipProps {
  setShowToggleInfo?: (showToggleInfo: boolean) => void;
}

const PanelToggleInfoToolTip = ({
  setShowToggleInfo
}: IPanelToggleInfoToolTipProps): JSX.Element => {
  return (
    <div className={styles.sv_toggle_tooltip_container}>
      <div className={styles.sv_toggle_tooltip_header}>
        <span className={classNames(styles.sv_toggle_tooltip_header_text, 'ng_h_4_b')}>
          ✨ Check out our side panel
        </span>
        <button
          className={styles.button_reset}
          onClick={() => {
            if (setShowToggleInfo) setShowToggleInfo(false);
          }}>
          <Close type="outline" className={styles.sv_toggle_tooltip_close_icon} />
        </button>
      </div>
      <span className={classNames(styles.sv_toggle_tooltip_content_text, 'ng_h_5_m')}>
        It looks like you’re running out of room on the top panel. Click here to move the pages to
        the side panel.
      </span>
    </div>
  );
};

export default PanelToggleInfoToolTip;
