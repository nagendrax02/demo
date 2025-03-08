import Modal from '@lsq/nextgen-preact/modal';
import { CONSTANTS } from '../../constants';
import { lazy, useState } from 'react';
import styles from './save-template-modal.module.css';
import { Variant } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));
const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

export interface ISaveTemplateModal {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (templateName: string, publish?: boolean) => Promise<void>;
}

const SaveTemplateModal = (props: ISaveTemplateModal): JSX.Element => {
  const { setShow, onSave } = props;
  const [templateName, setTemplateName] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleOnClick = async (publish: boolean): Promise<void> => {
    if (templateName.length > 0) {
      await onSave(templateName, publish);
      setShow(false);
    } else {
      setError(CONSTANTS.NAME_REQUIRED);
    }
  };

  return (
    <Modal show customStyleClass={styles.modal}>
      <Modal.Header
        title={CONSTANTS.SAVE_AS_TEMPLATE}
        onClose={() => {
          setShow(false);
        }}
      />
      <Modal.Body>
        <div className={styles.body}>
          <label className={styles.input_label}>Save as</label>
          <BaseInput
            value={templateName}
            setValue={(val) => {
              if (error) {
                // setError(undefined);
              }
              setTemplateName(val);
            }}
            customStyleClass={styles.input}
          />
          {error ? <div className={styles.error}>{error}</div> : null}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            text={CONSTANTS.CANCEL}
            variant={Variant.Secondary}
            onClick={() => {
              setShow(false);
            }}
          />
          <Button
            text={CONSTANTS.SAVE}
            variant={Variant.Primary}
            onClick={async () => {
              await handleOnClick(false);
            }}
          />
          <Button
            text={CONSTANTS.SAVE_AND_PUBLISH}
            variant={Variant.Primary}
            onClick={async () => {
              await handleOnClick(true);
            }}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SaveTemplateModal;
