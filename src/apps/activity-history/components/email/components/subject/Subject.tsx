import { IAdditionalDetails } from 'apps/activity-history/types';
import styles from './subject.module.css';
import { PreviewModal } from './components';
import { Suspense, useState } from 'react';
import { noteParser } from 'common/utils/helpers/activity-history';
export interface ISubject {
  additionalDetails: IAdditionalDetails;
}
const Subject = ({ additionalDetails }: ISubject): JSX.Element => {
  const [show, setShow] = useState(false);
  const eventNoteSubject = noteParser(additionalDetails?.ActivityEvent_Note || '')?.Subject || '';

  const emailSubject = additionalDetails?.EmailSubject || eventNoteSubject;

  const showPreviewModal = (): void => {
    setShow(true);
  };

  return (
    <>
      <span className={styles.link} data-testid="email-subject" onClick={showPreviewModal}>
        {emailSubject}
      </span>
      {show ? (
        <Suspense fallback={<></>}>
          <PreviewModal show={show} setShow={setShow} additionalDetails={additionalDetails} />
        </Suspense>
      ) : null}
    </>
  );
};

export default Subject;
