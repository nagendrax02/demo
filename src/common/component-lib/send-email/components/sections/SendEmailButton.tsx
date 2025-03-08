import { CONSTANTS } from '../../constants';
import Icon from '@lsq/nextgen-preact/icon';
import footerStyles from './sections.module.css';
import { Variant } from 'common/types';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { ISendEmailOptions } from '../../send-email.types';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const SendEmailButton = ({
  isDisabled,
  sendingEmail,
  onSend,
  options
}: {
  isDisabled?: boolean;
  sendingEmail: boolean;
  onSend: (scheduledTime?: string) => Promise<void>;
  options: ISendEmailOptions;
}): JSX.Element => {
  return (
    <Tooltip
      content={isDisabled ? CONSTANTS.SEND_EMAIL_BUTTON_TOOLTIP_MESSAGE : ''}
      placement={Placement.Vertical}
      trigger={[Trigger.Hover]}>
      <Button
        text={sendingEmail ? CONSTANTS.SENDING : CONSTANTS.SEND}
        title={''}
        onClick={() => {
          onSend();
        }}
        icon={
          <Icon
            name="send"
            variant={IconVariant.Filled}
            customStyleClass={footerStyles.send_button_icon}
          />
        }
        variant={Variant.Primary}
        customStyleClass={footerStyles.send_button}
        disabled={sendingEmail || options?.showSuccessMessage || isDisabled}
        isLoading={sendingEmail}
      />
    </Tooltip>
  );
};

export default SendEmailButton;
