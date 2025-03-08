import Modal from '@lsq/nextgen-preact/modal';
import { Dispatch, SetStateAction, useEffect, lazy } from 'react';
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import styles from './submission-retrieval.module.css';
import { Variant } from 'common/types';
import useSubmissionRetrieval from './useSubmissionRetrieval';
import Title from './Title';
import Spinner from '@lsq/nextgen-preact/spinner';
import { Sections } from './components';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import CapturedFromIcon from './components/captured-from-icon';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

export interface ISubmissionRetrieval {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  data: IAugmentedAHDetail;
  coreData?: IEntityDetailsCoreData;
}

const SubmissionRetrieval = (props: ISubmissionRetrieval): JSX.Element | null => {
  const { show, setShow, data, coreData } = props;
  const { AdditionalDetails } = data;
  const submissionFormId = AdditionalDetails?.SubmissionFormId;
  const { isLoading, isDataExist, normalizedData, formName, previewUrl, capturedFromConfig } =
    useSubmissionRetrieval({
      submissionFormId: submissionFormId || ''
    });

  const closeModal = (): void => {
    setShow(false);
  };

  const handleDownloadFile = (): void => {
    window.open(previewUrl, '_blank');
  };

  useEffect(() => {
    if (!isLoading && !isDataExist) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataExist, isLoading]);

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} customStyleClass={styles.submission_modal}>
      <Modal.Header
        title={<Title value={`${formName} - Submission Data`} isLoading={isLoading} />}
        onClose={closeModal}
      />
      <Modal.Body customStyleClass={styles.submission_body}>
        <div className={styles.submission_body_content}>
          {isLoading ? (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          ) : (
            <Sections normalizedData={normalizedData} coreData={coreData} />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <>
          <Button
            variant={Variant.Secondary}
            text={'Close'}
            onClick={closeModal}
            dataTestId="close-preview-modal"
          />
          {previewUrl ? (
            <Button
              variant={Variant.Primary}
              text={'Download'}
              onClick={handleDownloadFile}
              dataTestId="close-preview-modal"
              icon={<Icon name="download" variant={IconVariant.Filled} />}
            />
          ) : null}
          <CapturedFromIcon config={capturedFromConfig} />
        </>
      </Modal.Footer>
    </Modal>
  );
};

export default SubmissionRetrieval;
