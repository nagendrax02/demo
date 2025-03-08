import { lazy, Suspense, useState } from 'react';
import { IAutomationTooltipDetails } from 'apps/activity-history/types';
import styles from './automation.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import useAutomationText from './useAutomationText';
import withSuspense from '@lsq/nextgen-preact/suspense';
export interface IAutomationText {
  campaignActivityRecordId?: string;
  leadApiUrl?: string;
  automationToolTipDetails?: IAutomationTooltipDetails;
}

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const AutomationText = ({
  campaignActivityRecordId,
  leadApiUrl,
  automationToolTipDetails
}: IAutomationText): JSX.Element => {
  const [isClicked, setIsClicked] = useState(false);

  const { isLoading, data } = useAutomationText({
    isClicked,
    campaignActivityRecordId,
    leadApiUrl,
    automationToolTipDetails
  });

  const tooltipContent = (): JSX.Element => {
    if (isLoading) return <Shimmer height="18px" width="150px" />;
    if (data.Action)
      return (
        <div>
          <span>Name: {data.Name}</span>
          <span> Action: {data.Action}</span>
        </div>
      );
    return <span className={styles.name}>Name: {data.Name}</span>;
  };

  return (
    <span
      className={styles.link}
      onClick={(): void => {
        setIsClicked(true);
      }}>
      <Suspense fallback={<></>}>
        <Tooltip
          theme={Theme.Light}
          content={tooltipContent()}
          placement={Placement.Vertical}
          trigger={[Trigger.Click]}>
          <>Automation </>
        </Tooltip>
      </Suspense>
    </span>
  );
};

AutomationText.defaultProps = {
  campaignActivityRecordId: undefined,
  leadApiUrl: undefined,
  automationToolTipDetails: undefined
};

export default AutomationText;
