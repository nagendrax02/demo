import { Suspense } from 'react';
import { ACTIVITY } from '../../constants';
import { IAugmentedAHDetail } from '../../types';
import ActivityScore from '../shared/activity-score';
import BodyWrapper from '../shared/body-wrapper';
import { DynamicFormActivity } from './components';
import Payment from '../shared/payment';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

interface IBody {
  data: IAugmentedAHDetail;
  coreData: IEntityDetailsCoreData;
}

const Body = ({ data, coreData }: IBody): JSX.Element => {
  const { AdditionalDetails } = data;

  const { entityIds } = coreData;

  const activityEvent = data?.ActivityEvent;
  let renderActivity = <></>;

  switch (activityEvent) {
    case ACTIVITY.DYNAMIC_FORM_SUBMISSION:
      renderActivity = <DynamicFormActivity data={data} coreData={coreData} />;
      break;

    case ACTIVITY.PAYMENT:
      renderActivity = <Payment data={data} entityIds={entityIds} />;
      break;

    default:
      renderActivity = <></>;
  }

  return (
    <BodyWrapper>
      <>
        <Suspense fallback={<></>}>{renderActivity}</Suspense>
        <ActivityScore activityScore={`${AdditionalDetails?.ActivityScore || 0}`} />
      </>
    </BodyWrapper>
  );
};

export default Body;
