import { trackError } from 'common/utils/experience/utils/track-error';
import React, { useState, lazy } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import { Variant } from 'common/types';
import styles from './change-primary-contact.module.css';
import useEntityDetailStore from '../../entitydetail.store';
import { IPropertiesConfig } from '../../types';
import { ASSOCIATED_LEAD_SCHEMA_NAME } from '../../constants';
import { fetchOptions } from './utils';
import { AssociatedEntity } from 'common/component-lib/associated-entity-dropdown';
import { IAssociatedAccountOption, IHandleResponse } from './change-primary-contact.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { API_ROUTES, APP_ROUTE } from 'common/constants';
import { getAccountTypeId, isMiP } from 'common/utils/helpers/helpers';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

export interface IChangePrimaryContact {
  showChangePrimaryContactModal: boolean;
  setShowChangePrimaryContactModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentPrimaryContactId?: string | null | undefined;
}

const ChangePrimaryContact = (props: IChangePrimaryContact): JSX.Element => {
  const {
    showChangePrimaryContactModal,
    setShowChangePrimaryContactModal,
    currentPrimaryContactId
  } = props;
  const [disabledSave, setDisabledSave] = useState<boolean>(true);

  const [selectedOption, setSelectedOption] = useState<IAssociatedAccountOption[]>();

  const { showAlert } = useNotification();

  const augmentedEntityProperty = useEntityDetailStore(
    (state) => state?.augmentedEntityData?.associatedLeadProperties
  ) as IPropertiesConfig;

  const getLabel = (): string => {
    const schemaName = augmentedEntityProperty?.entityProperty?.find((element) => {
      return element.id === ASSOCIATED_LEAD_SCHEMA_NAME;
    });
    return schemaName?.value || '';
  };

  const handleSelection = (options): void => {
    setDisabledSave(false);
    setSelectedOption(options);
  };

  const displayConfig = {
    titleKeys: ['FirstName', 'LastName'],
    body: [
      { key: 'EmailAddress', label: 'Email' },
      { key: 'Mobile', label: 'Mobile Number' },
      { key: 'Phone', label: 'Phone Number' }
    ],
    fallbackTitleKeys: ['LastName', 'EmailAddress', 'Mobile', 'Phone']
  };

  const openInNewTab = (): void => {
    window.open(
      `${isMiP() ? APP_ROUTE.platformLD : APP_ROUTE.leadDetails}?LeadID=${selectedOption?.[0]
        ?.ProspectID}`
    );
  };

  const handleSave = async (): Promise<void> => {
    try {
      setDisabledSave(true);
      const path = `${
        API_ROUTES.setPrimaryContact
      }?&accountTypeId=${getAccountTypeId()}&leadId=${selectedOption?.[0]?.ProspectID}`;
      const response = (await httpGet({
        path,
        module: Module.Marvin,
        callerSource: CallerSource?.SetPrimaryAccount
      })) as IHandleResponse;

      if (response.Status === 'Success') {
        showAlert({
          type: Type.SUCCESS,
          message: 'Primary contact updated successfully'
        });
      }
      updateLeadAndLeadTabs();
    } catch (error) {
      trackError(error);
      showAlert({
        type: Type.ERROR,
        message: 'Error occurred while processing your request.'
      });
    }
    setShowChangePrimaryContactModal(false);
  };

  return (
    <>
      <Modal show={showChangePrimaryContactModal} customStyleClass={styles.modal}>
        <Modal.Header
          title="Change Primary Contact"
          onClose={(): void => {
            setShowChangePrimaryContactModal(false);
          }}
        />
        <Modal.Body customStyleClass={styles.body}>
          <>
            <div className={styles.title}>Current Primary Contact</div>
            <div className={styles.property_name}>{getLabel()}</div>
            <div className={styles.title}>Update To</div>

            <div className={styles.primary_contact_container}>
              <AssociatedEntity
                displayConfig={displayConfig}
                fetchOptions={fetchOptions}
                valueKey="ProspectID"
                setSelectedValues={handleSelection}
                placeHolderText="Search to select Lead"
                selectedValues={selectedOption}
                suspenseFallback={<Shimmer height="32px" width="100%" />}
                openInNewTabHandler={openInNewTab}
                currentPrimaryContactId={currentPrimaryContactId || ''}
              />
            </div>
          </>
        </Modal.Body>

        <Modal.Footer>
          <>
            <Button
              text="Update"
              onClick={handleSave}
              disabled={disabledSave}
              variant={Variant.Primary}
            />
            <Button
              text="Cancel"
              onClick={(): void => {
                setShowChangePrimaryContactModal(false);
              }}
              variant={Variant.Secondary}
            />
          </>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangePrimaryContact;
