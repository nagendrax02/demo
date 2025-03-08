import { useEffect, useState } from 'react';
import Button from 'common/component-lib/button';
import { Variant } from 'common/types';
import styles from './delete-all-lead.module.css';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { CONSTANTS } from './constants';
import { trackError } from 'common/utils/experience';
import DeleteAllLeadBody from './DeleteAllLeadBody';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { showNotification } from '@lsq/nextgen-preact/notification';
import Modal from '@lsq/nextgen-preact/modal';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { getListId } from 'common/utils/helpers/helpers';
import SuccessModal from 'apps/smart-views/components/custom-tabs/manage-list-lead-detail/success-modal';
import RequestHistorySubDescription from 'apps/smart-views/components/custom-tabs/manage-list-lead-detail/success-modal/RequestHistory';
import { IEntityRepresentationName } from '../../types/entity-data.types';
import { updateEntityName } from './utils';

export interface IDeleteAllLead {
  handleClose: () => void;
  repName?: IEntityRepresentationName;
}

const DeleteAllLead = (props: IDeleteAllLead): JSX.Element => {
  const { handleClose, repName } = props;
  const [value, setValue] = useState('');
  const [load, setLoad] = useState<{
    disable: boolean;
    isLoading: boolean;
    showSuccessMessage: boolean;
  }>({
    disable: true,
    isLoading: false,
    showSuccessMessage: false
  });

  useEffect(() => {
    if (value === updateEntityName(CONSTANTS.DELETE_ALL_LEAD_PLURAL, repName)) {
      setLoad((prev) => {
        return { ...prev, disable: false };
      });
    } else {
      setLoad((prev) => {
        return { ...prev, disable: true };
      });
    }
  }, [value]);

  const handleDeleteAllLead = async (): Promise<void> => {
    try {
      const listId = getListId();
      setLoad((prev) => {
        return { ...prev, isLoading: true };
      });
      await httpPost({
        path: `${API_ROUTES.listLeadsDelete}?listId=${listId}`,
        module: Module.Marvin,
        body: {
          ListID: listId
        },
        callerSource: CallerSource.ManageListDetails
      });
      setLoad((prev) => {
        return { ...prev, isLoading: false, showSuccessMessage: true };
      });
    } catch (error) {
      trackError(error);
      showNotification({
        type: Type.ERROR,
        message: `${error?.response?.ExceptionMessage || error?.message}`
      });
      setLoad((prev) => {
        return { ...prev, isLoading: false };
      });
    }
  };

  return (
    <>
      {!load.showSuccessMessage ? (
        <Modal show customStyleClass={styles.modal}>
          <Modal.Header
            title={updateEntityName(CONSTANTS.DELETE_MODAL_TITLE, repName)}
            onClose={(): void => {
              handleClose();
            }}
          />
          <Modal.Body customStyleClass={styles.body}>
            <DeleteAllLeadBody value={value} setValue={setValue} repName={repName} />
          </Modal.Body>
          <Modal.Footer>
            <div className={styles.footer}>
              <Tooltip
                content={load?.disable ? CONSTANTS.TOOLTIP_TEXT : ''}
                placement={Placement.Vertical}
                trigger={[Trigger.Hover]}>
                <Button
                  customStyleClass={styles.btn}
                  text="Yes, Delete"
                  onClick={handleDeleteAllLead}
                  isLoading={load.isLoading}
                  disabled={load?.disable}
                  variant={Variant.Error}
                />
              </Tooltip>
              <Button
                customStyleClass={styles.btn}
                text="No, Keep"
                onClick={(): void => {
                  handleClose();
                }}
                variant={Variant.Primary}
              />
            </div>
          </Modal.Footer>
        </Modal>
      ) : (
        <SuccessModal
          handleClose={handleClose}
          title={CONSTANTS.DELETE_REQUEST}
          message={updateEntityName(CONSTANTS.SUCCESS_MESSAGE, repName)}
          description={CONSTANTS.SUCCESS_DESCRIPTION}
          subDescription={<RequestHistorySubDescription />}
        />
      )}
    </>
  );
};

export default DeleteAllLead;
