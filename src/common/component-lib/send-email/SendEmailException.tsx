import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Theme } from '@lsq/nextgen-preact/common/common.types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import styles from './send-email.module.css';
import { safeParseJson } from 'common/utils/helpers';
import { getLeadTypeName } from 'common/utils/lead-type/settings';
import { CallerSource } from 'common/utils/rest-client';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { useEffect, useState } from 'react';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { ERROR_MSG } from '../../utils/rest-client/constant';
interface IMailMergeExceptionMessage {
  errorMessage: string;
  leadTypeInternalName: string;
}
const MailMergeExceptionMessage = ({
  errorMessage,
  leadTypeInternalName
}: IMailMergeExceptionMessage): JSX.Element => {
  const errorMessages = safeParseJson(errorMessage) as string[];
  const [leadTypeName, setLeadTypeName] = useState<string>('');

  useEffect(() => {
    (async (): Promise<void> => {
      setLeadTypeName(
        await getLeadTypeName(leadTypeInternalName ?? '', CallerSource.ScheduledEmail)
      );
    })();
  }, [leadTypeInternalName]);

  const tooltipContent = (
    <ul className={styles.tooltip_content}>
      {errorMessages.map((item) => (
        <li key={item.trim()}>{item.trim()}</li>
      ))}
    </ul>
  );

  return (
    <span>
      Some{' '}
      <Tooltip
        content={tooltipContent}
        theme={Theme.Light}
        placement={Placement.Vertical}
        trigger={[Trigger.Hover]}
        customStyle={{ zIndex: 999999999 }}>
        <span className={styles.hoverable_text}> Mail Merge Fields</span>
      </Tooltip>{' '}
      are not associated with leadtype <strong>{leadTypeName ? leadTypeName : 'Lead'}</strong>.
      Please remove them to proceed.
    </span>
  );
};

export const handleEmailError = (err: Error, leadType: string | undefined): void => {
  if (err?.name === 'MXInvalidLeadTypeMailMergeException' && leadType) {
    showNotification({
      type: Type.ERROR,
      message: (
        <MailMergeExceptionMessage errorMessage={err.message} leadTypeInternalName={leadType} />
      )
    });
  } else if (err?.name !== 'ValidationError') {
    showNotification({
      type: Type.ERROR,
      message: err?.message ? `${err?.message}` : ERROR_MSG.generic
    });
  }
};
export default MailMergeExceptionMessage;
