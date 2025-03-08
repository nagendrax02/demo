import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { convertSecondsToMinute } from 'common/utils/helpers/activity-history';
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import PageVisitedInWebsiteTable from './PageVisitedInWebsiteTable';

interface IPageVisitedOnWebsite {
  data: IAugmentedAHDetail;
}

const PageVisitedOnWebsite = ({ data }: IPageVisitedOnWebsite): JSX.Element => {
  const additionalDetails = data.AdditionalDetails;

  const { IsLandingPage, ActivityEventCount, TimeSpent, TrafficSource } = additionalDetails || {};

  const getText = (): string => {
    if (IsLandingPage === '1') {
      return 'Viewed landing page';
    }

    return `Viewed ${
      ActivityEventCount === '1' ? '1 unique page' : `${ActivityEventCount} unique pages`
    }`;
  };

  return (
    <>
      <span>
        {getText()} and spent {convertSecondsToMinute(Number(TimeSpent))}. (Activity Source -{' '}
        {TrafficSource})
      </span>
      <Accordion
        name="View Details"
        defaultState={DefaultState.CLOSE}
        arrowRotate={{
          angle: ArrowRotateAngle.Deg90,
          direction: ArrowRotateDirection.ClockWise
        }}>
        <PageVisitedInWebsiteTable data={data} />
      </Accordion>
    </>
  );
};

export default PageVisitedOnWebsite;
