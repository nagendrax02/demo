import { IAugmentedAHDetail } from 'apps/activity-history/types';
import styles from './payment.module.css';
import PaymentDetails from './PaymentDetails';
import MetaDataInfo from '../metadata-info';
import Opportunity from '../opportunity';
import { CallerSource } from 'src/common/utils/rest-client';
import { IEntityIds } from '../../../../entity-details/types/entity-store.types';
export interface IPayment {
  data: IAugmentedAHDetail;
  showMetaData?: boolean;
  entityIds?: IEntityIds;
}

const getPaymentStatus = (status: string | undefined): string => {
  if (status?.toLowerCase()?.includes('success')) {
    return 'Successful';
  }
  if (status?.toLowerCase()?.includes('fail')) {
    return 'Failed';
  }
  return '';
};

const Payment = ({ data, showMetaData, entityIds }: IPayment): JSX.Element => {
  const { AdditionalDetails } = data;
  const isOppDetailsPage = !!entityIds?.opportunity;
  const paymentAmount = AdditionalDetails?.PaymentAmount;
  const paymentProvider = AdditionalDetails?.PaymentProvider;
  const paymentStatus = AdditionalDetails?.PaymentStatus;
  const activityEventNote = AdditionalDetails?.ActivityEvent_Note;
  const createdByName = AdditionalDetails?.CreatedByName || '';
  const createdBy = AdditionalDetails?.CreatedBy || '';
  const activityDateTime = data?.ActivityDateTime;

  const getOppLink = (): JSX.Element | undefined => {
    if (!isOppDetailsPage) {
      return (
        <Opportunity
          activityEvent={data?.ActivityEvent as number}
          leadId={data?.LeadId}
          additionalDetails={AdditionalDetails}
        />
      );
    }
  };

  return (
    <div className={styles.payment}>
      <div>
        {getPaymentStatus(paymentStatus)} payment of {paymentAmount} was made through{' '}
        {paymentProvider}
      </div>
      <PaymentDetails data={data} amount={paymentAmount || ''} provider={paymentProvider || ''} />
      {activityEventNote ? (
        <div className={styles.activity_event_note}>{activityEventNote}</div>
      ) : null}
      {getOppLink()}
      {showMetaData ? (
        <MetaDataInfo
          byLabel="Added by"
          createdByName={createdByName}
          createdBy={createdBy}
          activityDateTime={activityDateTime}
          callerSource={CallerSource.ActivityHistoryPaymentActivity}
        />
      ) : null}
    </div>
  );
};

Payment.defaultProps = {
  showMetaData: true,
  entityIds: undefined
};

export default Payment;
