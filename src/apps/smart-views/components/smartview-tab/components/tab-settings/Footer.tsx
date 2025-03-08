import { ModalFooter } from '@lsq/nextgen-preact/v2/modal';
import styles from './tab-settings.module.css';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import useTabSettingsStore from './tab-settings.store';
import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { classNames } from 'common/utils/helpers/helpers';

const Button = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/v2/button').then((module) => ({ default: module.Button })))
);

interface IFooter {
  onClose: () => void;
  onRestoreDefault: () => void;
  onSave: () => void;
  selectedAction: IMenuItem | null;
}

const Footer = (props: IFooter): JSX.Element => {
  const { onClose, onRestoreDefault, onSave, selectedAction } = props;

  const { entityExportSucceeded, submitButtonDisabled, isLoading } = useTabSettingsStore();

  const buttonStyleClass = classNames(styles.footer_button, 'ng_v2_style', 'ng_btn_2_b');
  const primaryButtonText =
    selectedAction?.value === HeaderAction.ExportLeads ? 'Export' : 'Update';

  return (
    <ModalFooter customStyleClass={styles.modal_footer}>
      <>
        {entityExportSucceeded ? (
          <>
            <Button
              title="Ok"
              variant="secondary-gray"
              text={<div className={buttonStyleClass}>Ok</div>}
              onClick={onClose}
              dataTestId="close-tab-settings-modal"
            />
          </>
        ) : (
          <>
            <Button
              variant="primary"
              text={<div className={buttonStyleClass}>{primaryButtonText}</div>}
              onClick={onSave}
              dataTestId="close-tab-settings-modal"
              disabled={submitButtonDisabled}
              isLoading={isLoading}
              title={primaryButtonText}
            />
            {selectedAction?.value !== HeaderAction?.ExportLeads ? (
              <Button
                variant="secondary-gray"
                text={<div className={buttonStyleClass}>Restore Default</div>}
                onClick={onRestoreDefault}
                dataTestId="restore-default"
                title="Restore Default"
              />
            ) : null}
          </>
        )}
      </>
    </ModalFooter>
  );
};

export default Footer;
