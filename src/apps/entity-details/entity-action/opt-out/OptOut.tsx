import React, { useEffect, useState, lazy } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import { Variant } from 'common/types';
import styles from './optout.module.css';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import withSuspense from '@lsq/nextgen-preact/suspense';
import useEntityDetailStore from '../../entitydetail.store';
import { IActionMenuItem, IAugmentedAction, IAugmentedEntity } from '../../types/entity-data.types';
import useEntityTabsStore from 'common/component-lib/entity-tabs/store';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

export interface IOptOut {
  leadId: string;
  leadRepresent: string;
  handleClose: () => void;
  onSuccess?: () => void | undefined;
}

const OptOut = (props: IOptOut): JSX.Element => {
  const { leadId, leadRepresent, handleClose } = props;
  const [disabledSave, setDisabledSave] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const primaryAction = useEntityDetailStore(
    (state) => state.augmentedEntityData?.vcard?.body?.primarySection?.components
  );

  const { setRefreshTab } = useEntityTabsStore();

  const augmentedData = useEntityDetailStore((state) => state.augmentedEntityData);
  const setAugmentedData = useEntityDetailStore((state) => state.setAugmentedEntityData);

  const { showAlert } = useNotification();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    setDisabledSave(false);
    setMessage('');
  }, []);

  const handleDisableEmail = (): void => {
    const updatedPrimaryAction = primaryAction?.map((action) => {
      if (action?.type === 4) {
        (action?.config as IAugmentedAction)?.actions?.map((act) => {
          if (act?.id === 'SendEmail') {
            act?.subMenu?.map((mail: IActionMenuItem) => {
              if (mail?.id === 'SendEmailAction') {
                mail.disabled = true;
              }
              return mail;
            });
          }
          return act;
        });
      }
      return action;
    });
    const updatedDetails = {
      ...augmentedData,
      vcard: {
        ...augmentedData?.vcard,
        body: {
          ...augmentedData?.vcard?.body,
          primarySection: {
            ...augmentedData?.vcard?.body?.primarySection,
            components: updatedPrimaryAction
          }
        }
      }
    } as IAugmentedEntity;
    setAugmentedData(updatedDetails);
  };

  const handleApiCall = async (): Promise<void> => {
    setDisabledSave(true);

    try {
      const path = API_ROUTES.optout;
      const response = await httpPost({
        path,
        module: Module.Marvin,
        body: {
          leadId,
          reason: message
        },
        callerSource: CallerSource.LeadDetailsVCard
      });
      if (response) {
        showAlert({
          type: Type.SUCCESS,
          message: `Marked opt out for ${leadRepresent}.`
        });
        handleDisableEmail();
        setRefreshTab();
        updateLeadAndLeadTabs();
      }
    } catch (e) {
      showAlert({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <Modal show customStyleClass={styles.modal}>
        <Modal.Header
          title="Opt Out"
          onClose={(): void => {
            handleClose();
          }}
        />
        <Modal.Body customStyleClass={styles.body}>
          <div className={styles.body_container}>
            <div className={styles.body_header}>
              <div className={styles.body_header_label}> Reason</div>
            </div>
            <div className={styles.text_area_container}>
              <TextArea
                handleMessageChange={handleMessageChange}
                message={message}
                maxLength={200}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.footer}>
            <Button
              customStyleClass={styles.primary}
              text="Ok"
              onClick={(): void => {
                handleApiCall();
              }}
              isLoading={disabledSave}
              disabled={disabledSave}
              variant={Variant.Primary}
            />
            <Button
              customStyleClass={styles.secondary}
              text="Cancel"
              onClick={(): void => {
                handleClose();
              }}
              variant={Variant.Secondary}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OptOut;
