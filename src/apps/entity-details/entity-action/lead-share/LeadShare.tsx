import { createPortal } from 'react-dom';
import Modal from '@lsq/nextgen-preact/modal';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { useState } from 'react';
import Footer from './components/Footer';
import { IGroupedOption } from '../../../../common/component-lib/grouped-option-dropdown';
import { getDefaultSelectedUser, handleSave } from './utils';
import { useNotification } from '@lsq/nextgen-preact/notification';
import Body from './components/Body';
import styles from './lead-share.module.css';
import { IEntityRepresentationName } from '../../types/entity-data.types';

export interface IAddNotes {
  entityId?: string;
  showModal: boolean;
  leadRepName?: IEntityRepresentationName;
  customFieldsConfig?: Record<string, string | null>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadShare = (props: IAddNotes): JSX.Element => {
  const { showModal, setShowModal, entityId, customFieldsConfig, leadRepName } = props;
  const { augmentedEntityData } = useEntityDetailStore();
  let representationName = useLeadRepName();

  if (leadRepName) {
    representationName = leadRepName;
  }

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useNotification();
  const leadFields =
    Object.keys(customFieldsConfig || {})?.length !== 0
      ? customFieldsConfig
      : augmentedEntityData?.attributes?.fields;
  const [selectedUsers, setSelectedUsers] = useState<IGroupedOption[]>(
    getDefaultSelectedUser(leadFields)
  );

  const getTitle = (): string => {
    const firstName = leadFields?.FirstName;
    const lastName = leadFields?.LastName;
    const leadName = `${firstName || ''} ${lastName || ''}`;
    return `Share ${representationName?.SingularName || 'Lead'} via Email - ${leadName}`;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    setMessage(value);
  };

  const onSave = async (): Promise<void> => {
    await handleSave({
      setIsLoading,
      showAlert,
      selectedUsers,
      message,
      entityId,
      representationName: representationName?.SingularName
    });
    setShowModal(false);
  };

  return createPortal(
    <Modal show={showModal} customStyleClass={styles.modal}>
      <Modal.Header
        title={getTitle()}
        onClose={(): void => {
          setShowModal(false);
        }}
      />
      <Modal.Body>
        <Body
          onMessageChange={handleMessageChange}
          message={message}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
        />
      </Modal.Body>
      <Modal.Footer>
        <Footer
          setShowModal={setShowModal}
          onSave={onSave}
          isDisabled={isLoading || !selectedUsers.length}
          isLoading={isLoading}
        />
      </Modal.Footer>
    </Modal>,
    document.body
  );
};

export default LeadShare;
