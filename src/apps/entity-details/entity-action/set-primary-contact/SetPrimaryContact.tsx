import withSuspense from '@lsq/nextgen-preact/suspense';
import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { Variant } from 'common/types';
import { useState, lazy } from 'react';
import styles from './set-primary-contact.module.css';
import { IButtonConfig } from '@lsq/nextgen-preact/modal/confirmation-modal/confirmation-modal.types';
import { getAccountTypeId, getLeadName } from 'common/utils/helpers/helpers';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { API_ROUTES, MASKED_TEXT } from 'common/constants';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { createPortal } from 'react-dom';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { ExceptionType, IError } from 'common/types/error.types';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

export interface ISetPrimaryContact {
  handleClose: () => void;
  customConfig?: Record<string, string | null>;
  onSuccess?: () => void;
}

const SetPrimaryContact = (props: ISetPrimaryContact): JSX.Element => {
  const { handleClose, customConfig, onSuccess } = props;

  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useNotification();
  const properties = useEntityDetailStore((state) => state.augmentedEntityData?.properties);

  const handleSetPrimaryContact = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const entityDetails = properties?.fields || {};
      const accountTypeId =
        entityDetails?.CompanyType === MASKED_TEXT
          ? entityDetails?.CompanyType1
          : entityDetails?.CompanyType || getAccountTypeId();
      const path = `${API_ROUTES.setPrimaryContact}?&accountTypeId=${accountTypeId}&leadId=${
        customConfig?.id ?? customConfig?.ProspectID
      }`;
      const response = (await httpGet({
        path,
        module: Module.Marvin,
        callerSource: getAccountTypeId() ? CallerSource?.AccountDetails : CallerSource.LeadDetails
      })) as { Status: string };

      if (response.Status === 'Success') {
        showAlert({
          type: Type.SUCCESS,
          message: 'Primary contact updated successfully'
        });
        updateLeadAndLeadTabs();
      }
      onSuccess?.();
    } catch (error) {
      if (
        (error as IError)?.response?.ExceptionType === ExceptionType.MXUnAuthorizedAccessException
      ) {
        showAlert({
          type: Type.ERROR,
          message: (error as IError)?.response?.ExceptionMessage
        });
      } else
        showAlert({
          type: Type.ERROR,
          message: ERROR_MSG.generic
        });
      trackError(error);
    }
    setIsLoading(false);
    handleClose();
  };

  const buttonConfig: IButtonConfig[] = [
    {
      id: 1,
      name: 'Yes',
      variant: Variant.Primary,
      onClick: handleSetPrimaryContact,
      showSpinnerOnClick: true,
      isDisabled: isLoading
    },
    {
      id: 2,
      name: 'Cancel',
      variant: Variant.Secondary,
      onClick: (): void => {
        handleClose();
      },
      isDisabled: isLoading
    }
  ];

  return (
    <>
      {createPortal(
        <ConfirmationModal
          onClose={handleClose}
          show
          title="Confirm"
          description={`Are you sure, you want to set "${getLeadName(
            customConfig ?? {}
          )}" as primary contact?`}
          customStyleClass={styles.custom_body}
          buttonConfig={buttonConfig}
        />,
        document.body
      )}
    </>
  );
};

SetPrimaryContact.defaultProps = {
  onSuccess: (): void => {},
  customConfig: {}
};

export default SetPrimaryContact;
