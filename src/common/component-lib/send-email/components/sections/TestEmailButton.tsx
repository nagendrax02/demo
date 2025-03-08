import { CONSTANTS } from '../../constants';
import Icon from '@lsq/nextgen-preact/icon';
import footerStyles from './sections.module.css';
import { Variant } from 'common/types';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const TestEmailButton = ({
  handleTestEmail,
  enableTestEmailFeature
}: {
  handleTestEmail: () => void;
  enableTestEmailFeature?: boolean;
}): JSX.Element => {
  return (
    <Button
      text={CONSTANTS.TEST_EMAIL}
      onClick={() => {
        handleTestEmail();
      }}
      icon={
        <Icon
          name="science"
          variant={IconVariant.Filled}
          customStyleClass={footerStyles.send_button_icon}
        />
      }
      variant={Variant.Primary}
      customStyleClass={enableTestEmailFeature ? footerStyles.test_email_btn : footerStyles.hide}
    />
  );
};

export default TestEmailButton;
