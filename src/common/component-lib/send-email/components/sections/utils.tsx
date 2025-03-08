import footerStyles from './sections.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { CONSTANTS } from '../../constants';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ISendEmailOptions } from '../../send-email.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import TestEmailButton from './TestEmailButton';
import SendEmailButton from './SendEmailButton';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const getScheduleButtonTooltipText = (isDisabled?: boolean): string => {
  if (isDisabled) {
    return CONSTANTS.SEND_EMAIL_BUTTON_TOOLTIP_MESSAGE;
  }
  return CONSTANTS.SCHEDULE_EMAIL;
};

const getFooter = ({
  isLoading,
  handleSaveTemplateModal,
  handleScheduleEmailModal,
  handleFileLibrary,
  sendingEmail,
  options,
  onSend,
  enableTestEmailFeature,
  isDisabled,
  handleTestEmail
}: {
  isLoading: boolean;
  handleSaveTemplateModal: () => void;
  handleScheduleEmailModal: () => void;
  handleFileLibrary: () => void;
  sendingEmail: boolean;
  options: ISendEmailOptions;
  onSend: (scheduledTime?: string) => Promise<void>;
  enableTestEmailFeature?: boolean;
  isDisabled?: boolean;
  handleTestEmail: () => void;
}): JSX.Element => {
  if (isLoading) {
    return <Shimmer className={footerStyles.footer_shimmer} />;
  }

  return (
    <>
      <button
        className={enableTestEmailFeature ? footerStyles.hide : footerStyles.save_template_button}
        onClick={handleSaveTemplateModal}>
        {CONSTANTS.SAVE_AS_TEMPLATE}
      </button>
      <div className={footerStyles.email_actions}>
        <Button
          text=""
          onClick={handleFileLibrary}
          customStyleClass={
            enableTestEmailFeature ? footerStyles.hide : footerStyles.attach_file_btn
          }
          icon={
            <Icon
              name="attach_file"
              variant={IconVariant.Outlined}
              customStyleClass={footerStyles.attach_file_icon}
            />
          }
        />
        <Button
          text=""
          title={getScheduleButtonTooltipText(isDisabled)}
          onClick={handleScheduleEmailModal}
          customStyleClass={footerStyles.schedule_btn}
          icon={
            <Icon
              name="schedule_send"
              variant={IconVariant.Outlined}
              customStyleClass={footerStyles.schedule_button_icon}
            />
          }
          disabled={isDisabled}
        />

        <SendEmailButton
          isDisabled={isDisabled}
          sendingEmail={sendingEmail}
          onSend={onSend}
          options={options}
        />
        <TestEmailButton
          handleTestEmail={handleTestEmail}
          enableTestEmailFeature={enableTestEmailFeature}
        />
      </div>
    </>
  );
};

export { getFooter };
