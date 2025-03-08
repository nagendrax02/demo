import { Information } from 'assets/custom-icon/v2';
import styles from '../list-details-info.module.css';
import { useState } from 'react';
import Modal, { ModalBody, ModalHeader } from '@lsq/nextgen-preact/v2/modal';
import InfoBox from './InfoBox';
import { IListDetails } from '../../list-details.types';
import ListTypeBadge from '../ListTypeBadge';
import { getListDetails } from '../../utils';
import { CallerSource } from 'common/utils/rest-client';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const ListInfoModal = (): JSX.Element => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [listDetails, setListDetails] = useState<IListDetails>();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);
    setShowInfoModal(true);
    const response = await getListDetails(CallerSource.ListDetails);
    setListDetails(response);
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={handleClick} className={styles.info_icon_container}>
        <Information type="outline" className={styles.info_icon} />
      </button>
      <div>
        <Modal show={showInfoModal} customStyleClass={styles.modal_container}>
          <ModalHeader
            customStyleClass={styles.modal_header_styles}
            onClose={() => {
              setShowInfoModal(false);
            }}
            title={<ListTypeBadge title={listDetails?.Name} listDetails={listDetails} />}
            description={
              <div className={styles.ellipsis} title={listDetails?.Description}>
                {listDetails?.Description}
              </div>
            }
          />
          <ModalBody customStyleClass={styles.modal_body}>
            {isLoading ? (
              <>
                <Shimmer height="85px" width="450px" />
                <Shimmer height="85px" width="450px" />
              </>
            ) : (
              <>
                <InfoBox
                  label="Modified By"
                  date={listDetails?.ModifiedOn as string}
                  user={listDetails?.ModifiedByName as string}
                />
                <InfoBox
                  label="Created By"
                  date={listDetails?.CreatedOn as string}
                  user={listDetails?.CreatedByName as string}
                />
              </>
            )}
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default ListInfoModal;
