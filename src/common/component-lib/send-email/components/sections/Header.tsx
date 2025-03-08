import SideModal from '@lsq/nextgen-preact/side-modal';
import { CONSTANTS } from '../../constants';
import useSendEmailStore from '../../send-email.store';

const Header = (): JSX.Element => {
  const { isLoading } = useSendEmailStore();

  return (
    <SideModal.Header
      title={CONSTANTS.SEND_EMAIL}
      isLoading={isLoading}
      customStyleClass="send-email-modal"
    />
  );
};

export default Header;
