import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, lazy } from 'react';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { Variant } from 'common/types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import styles from '../actions.module.css';
import SendEmail from 'common/component-lib/send-email';
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { IAuthenticationConfig } from 'common/types/authentication.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import useEntityTabsStore from 'src/common/component-lib/entity-tabs/store';
import { CallerSource } from 'common/utils/rest-client';
import { getLeadName } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

export interface IReplyEmail {
  data: IAugmentedAHDetail;
}

export interface IOpportunity {
  ProspectOpportunityId: string;
  OpportunityEventId: number;
  OpportunityName: string;
  IsEmailFromOpportunity?: boolean;
}

const ToolTip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const ReplyEmail = (props: IReplyEmail): JSX.Element | null => {
  const { data } = props;
  const [showSendEmail, setShowSendEmail] = useState(false);

  const { setRefreshTab } = useEntityTabsStore();

  const fields = useEntityDetailStore((state) => state?.augmentedEntityData?.attributes?.fields);
  const associatedEntityFields = useEntityDetailStore(
    (state) => state?.augmentedEntityData?.associatedEntityProperties?.fields
  );

  const leadName = getLeadName(fields, associatedEntityFields);

  const onClick = (): void => {
    setShowSendEmail(true);
  };

  const doNotEmail = fields?.DoNotEmail === '1';

  const tooltipContent = doNotEmail ? (
    <span className={styles.tooltip_text}>{`${leadName} opted out from email communication`}</span>
  ) : (
    'Reply via Email'
  );

  const emptyClick = (): void => {};

  const getFromUser = (): string => {
    const userInfo = getItem(StorageKey.Auth) as IAuthenticationConfig;
    return userInfo.User.Id;
  };

  const leadRepresentationName = useLeadRepName();

  const parseOpportunityDetails = (): IOpportunity | undefined => {
    try {
      return {
        ProspectOpportunityId: data?.AdditionalDetails?.MXEmail_ProspectOpportunityId || '',
        OpportunityEventId: parseInt(data?.AdditionalDetails?.MXEmail_OpportunityEventId || ''),
        OpportunityName: data?.AdditionalDetails?.MXEmail_OpportunityName || '',
        IsEmailFromOpportunity:
          (data?.AdditionalDetails?.MXEmail_IsEmailFromOpportunity &&
            data.AdditionalDetails.MXEmail_IsEmailFromOpportunity?.toLowerCase() === 'true') ||
          false
      };
    } catch (error) {
      trackError(error);
    }
  };

  const handleEmailSuccess = (): void => {
    setRefreshTab();
  };

  return (
    <>
      <span>
        <ToolTip
          content={tooltipContent}
          placement={Placement.Horizontal}
          trigger={[Trigger.Hover]}>
          <Button
            text={<Icon name="reply" customStyleClass={styles.reply_icon} />}
            onClick={doNotEmail ? emptyClick : onClick}
            variant={Variant.Secondary}
            customStyleClass={styles.button}
          />
        </ToolTip>
      </span>

      {showSendEmail ? (
        <SendEmail
          show={showSendEmail}
          setShow={setShowSendEmail}
          toLead={[{ label: '', value: data?.LeadId || '' }]}
          fromUserId={getFromUser()}
          leadRepresentationName={leadRepresentationName}
          activity={{
            ActivityEvent: data?.ActivityEvent,
            ActivityType: data?.ActivityType,
            ActivityId: data?.Id
          }}
          opportunity={parseOpportunityDetails()}
          handleSuccess={handleEmailSuccess}
          callerSource={CallerSource.ActivityHistory}
        />
      ) : null}
    </>
  );
};

export default ReplyEmail;
