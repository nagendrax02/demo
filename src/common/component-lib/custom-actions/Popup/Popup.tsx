import { useEffect, useState } from 'react';
import styles from './popup.module.css';
import Modal from '@lsq/nextgen-preact/modal';
import { IConnectorAction } from 'common/types/entity/lead';
import { callAnAPI, getAttributes } from '../utils';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { CallerSource, HttpMethod } from 'common/utils/rest-client';
import IFrame from 'common/component-lib/iframe';

export interface IPopup {
  loading?: boolean;
  callerSource: CallerSource;
  config: IConnectorAction;
  mailMergeData: Record<string, string>;
  onClose: () => void;
}

const Popup = ({ onClose, config, mailMergeData, callerSource }: IPopup): JSX.Element => {
  const { showAlert } = useNotification();
  const [popupLoading, setPopupLoading] = useState<boolean>(true);
  const [docContent, setDocContent] = useState<string | undefined>();
  const { configData = '', configURL = '' } = mailMergeData;
  const attributes = getAttributes(config);

  useEffect(() => {
    (async (): Promise<void> => {
      if (config.ActionConfig?.Method?.toUpperCase() === HttpMethod.Post && configData) {
        setPopupLoading(true);
        const response = await callAnAPI({
          actionConfig: config.ActionConfig,
          showPopup: true,
          configURL,
          showAlert,
          configData,
          callerSource
        });
        if (response) {
          setDocContent(response);
        } else {
          onClose();
          setDocContent(undefined);
        }
        setPopupLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configURL, configData]);

  return (
    <Modal show customStyleClass={styles.modal_content}>
      <Modal.Header title={config.DisplayText} onClose={onClose} customStyleClass={''} />
      <Modal.Body customStyleClass={styles.popup_body}>
        <IFrame
          srcDoc={docContent}
          src={configURL}
          augmentSrc={false}
          id={config.DisplayText}
          showSpinner={popupLoading}
          setShowSpinner={setPopupLoading}
          attributes={attributes}
        />
      </Modal.Body>
    </Modal>
  );
};

Popup.defaultProps = {
  customStyleClass: '',
  loading: true
};

export default Popup;
