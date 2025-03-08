import { IAugmentedAHDetail } from 'apps/activity-history/types';
import Subject from '../subject';
import styles from './email_response.module.css';
import MetaDataInfo from '../../../shared/metadata-info';
import { CallerSource } from 'src/common/utils/rest-client';

export interface IEmailResponse {
  data: IAugmentedAHDetail;
}

const EmailResponse = ({ data }: IEmailResponse): JSX.Element => {
  const { AdditionalDetails } = data;
  return (
    <>
      <div className={styles.title}>
        Email received with subject <Subject additionalDetails={AdditionalDetails} /> Tagged as
        &quot;{data?.ActivityName}&quot;{' '}
      </div>
      <MetaDataInfo
        byLabel="Added by"
        createdBy={AdditionalDetails?.CreatedBy}
        createdByName={AdditionalDetails?.CreatedByName}
        callerSource={CallerSource.ActivityHistoryEmailActivity}
      />
    </>
  );
};

export default EmailResponse;
