import { createPortal } from 'react-dom';
import { useState } from 'react';
import { IPreviewData } from './file-preview.types';
import styles from './file-preview.module.css';
import Modal from '@lsq/nextgen-preact/modal';
import PreviewRenderer from './preview-renderer';
import Button from '../button';
import Spinner from '@lsq/nextgen-preact/spinner';
import DownloadBtn from './download-btn/DownloadBtn';
import Notes from '../entity-fields/notes';
import Icon from '@lsq/nextgen-preact/icon';

export interface IFilePreview {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  previewData: IPreviewData[];
  title?: string;
  isLoading?: boolean;
  removeDownloadOption?: boolean;
  customStyleClass?: string;
  container?: HTMLElement;
  containerCustomStyleClass?: string;
}

const FilePreview = (props: IFilePreview): JSX.Element => {
  const {
    showModal,
    setShowModal,
    previewData,
    title,
    isLoading,
    removeDownloadOption,
    customStyleClass,
    container,
    containerCustomStyleClass
  } = props;
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  const handleNavButtons = (steps: number): void => {
    const newIndex = previewIndex + steps;
    if (newIndex >= 0 && newIndex <= previewData.length - 1) {
      setPreviewIndex(newIndex);
    }
  };

  const selectedFile = previewData?.[previewIndex];

  const getBody = (): JSX.Element => {
    if (isLoading) {
      return <Spinner />;
    }
    return <PreviewRenderer previewData={selectedFile} key={`file-${previewIndex}`} />;
  };

  const getFooter = (): JSX.Element => {
    if (!isLoading && previewData?.length > 1) {
      return (
        <Modal.Footer>
          <div className={styles.nav_button_wrapper}>
            <Button
              text={'Previous'}
              onClick={(): void => {
                handleNavButtons(-1);
              }}
              disabled={previewIndex - 1 < 0 ? true : false}
              icon={<Icon name="arrow_back" customStyleClass={styles.left_arrow} />}
            />
            <span className={styles.download_container}>
              {removeDownloadOption ? null : <DownloadBtn previewData={selectedFile} />}
              <Button
                text={'Next'}
                onClick={(): void => {
                  handleNavButtons(1);
                }}
                disabled={previewIndex + 1 > previewData?.length - 1 ? true : false}
                rightIcon={<Icon name="arrow_forward" customStyleClass={styles.right_arrow} />}
              />
            </span>
          </div>
        </Modal.Footer>
      );
    }
    return (
      <>
        {removeDownloadOption ? (
          <></>
        ) : (
          <Modal.Footer>
            <DownloadBtn previewData={selectedFile} />
          </Modal.Footer>
        )}
      </>
    );
  };

  const getHeader = (): JSX.Element => {
    const heading = title || selectedFile?.name || '';
    return (
      <>
        <div className={styles.header} title={heading}>
          {heading}
        </div>
        {selectedFile?.description ? (
          <div className={styles.description}>
            <Notes value={selectedFile.description} showToolTip />
          </div>
        ) : null}
      </>
    );
  };

  return createPortal(
    <Modal
      show={showModal}
      customStyleClass={`${styles.modal} ${customStyleClass}`}
      containerCustomStyleClass={containerCustomStyleClass}>
      <Modal.Header
        title={getHeader()}
        onClose={(): void => {
          setShowModal(false);
        }}
      />
      <Modal.Body>{getBody()}</Modal.Body>
      {getFooter()}
    </Modal>,
    container || document.body
  );
};

FilePreview.defaultProps = {
  title: undefined,
  isLoading: false,
  removeDownloadOption: false,
  customStyleClass: '',
  containerCustomStyleClass: ''
};

export default FilePreview;
