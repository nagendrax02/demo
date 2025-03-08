import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { IAugmentedAHDetail } from 'src/apps/activity-history/types';
import ActivityTable from 'common/component-lib/activity-table';
import { CallerSource } from 'common/utils/rest-client';

interface IPaymentDetails {
  data: IAugmentedAHDetail;
  amount: string;
  provider: string;
}

const PaymentDetails = ({ data, amount, provider }: IPaymentDetails): JSX.Element => {
  const { Id, ActivityType, ActivityEvent, AdditionalDetails } = data;
  return (
    <>
      {amount && provider ? (
        <Accordion
          name="View Details"
          defaultState={DefaultState.CLOSE}
          arrowRotate={{
            angle: ArrowRotateAngle.Deg90,
            direction: ArrowRotateDirection.ClockWise
          }}>
          <ActivityTable
            id={Id as string}
            typeCode={ActivityType as number}
            eventCode={ActivityEvent as number}
            additionalDetails={AdditionalDetails as Record<string, string>}
            callerSource={CallerSource.ActivityHistoryPaymentActivity}
          />
        </Accordion>
      ) : null}
    </>
  );
};

export default PaymentDetails;
