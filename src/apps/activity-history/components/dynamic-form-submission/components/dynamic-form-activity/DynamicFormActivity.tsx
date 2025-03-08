import { IAugmentedAHDetail } from 'apps/activity-history/types';
import UserName from 'common/component-lib/user-name';
import styles from './dynamic-form-activity.module.css';
import { Suspense, useState } from 'react';
import SubmissionRetrieval from '../submission-retrieval';
import { CallerSource } from 'src/common/utils/rest-client';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

export interface IDynamicFormActivity {
  data: IAugmentedAHDetail;
  coreData?: IEntityDetailsCoreData;
}

const DynamicFormActivity = ({ data, coreData }: IDynamicFormActivity): JSX.Element => {
  const [show, setShow] = useState(false);
  const { AdditionalDetails } = data;
  const user = AdditionalDetails?.CreatedByName || '';
  const createdByUserId = AdditionalDetails?.CreatedBy || '';

  const showSubmissionRetrieval = (): void => {
    setShow(true);
  };

  return (
    <>
      <div>
        <div className={styles.dynamic_form_activity}>
          <span className={styles.title}>
            Dynamic Form Submission: Dynamic Form was submitted by{' '}
            <UserName
              name={user}
              id={createdByUserId}
              callerSource={CallerSource.ActivityHistoryDynamicFormSubmission}
            />
          </span>
        </div>
        <div className={styles.view_details} onClick={showSubmissionRetrieval}>
          View Details
        </div>
      </div>
      <Suspense fallback={<></>}>
        {show ? (
          <SubmissionRetrieval show={show} setShow={setShow} data={data} coreData={coreData} />
        ) : null}
      </Suspense>
    </>
  );
};

export default DynamicFormActivity;
