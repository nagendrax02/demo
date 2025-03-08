import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import SideModal from '@lsq/nextgen-preact/side-modal';
import { Body, Footer, Header } from './components';
import styles from './send-email.module.css';
import useSendEmailUtils from './use-send-email-utils';
import useSendEmailStore from './send-email.store';
import SuccessMessage from '../success-message';
import { DEFAULT_SUCCESS_MESSAGE } from './constants';

import { IActivity, IOpportunity } from './send-email.types';
import { useEffect } from 'react';
import { CallerSource } from 'common/utils/rest-client';

export interface ISendEmail {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  toLead: IOption[];
  fromUserId: string;
  leadRepresentationName: IEntityRepresentationName;
  callerSource: CallerSource;
  customStyleClass?: string;
  activity?: IActivity;
  opportunity?: IOpportunity;
  handleSuccess?: () => void;
  isLoading?: boolean;
  leadTypeInternalName?: string;
  enableTestEmailFeature?: boolean;
}

const SendEmail = ({
  toLead,
  fromUserId,
  leadRepresentationName,
  show,
  setShow,
  customStyleClass,
  activity,
  opportunity,
  handleSuccess,
  callerSource,
  isLoading,
  leadTypeInternalName,
  enableTestEmailFeature
}: ISendEmail): JSX.Element => {
  const { handleEmailSend, handleTemplateSave, validateEmailData } = useSendEmailUtils({
    toField: toLead,
    fromId: fromUserId,
    leadRepresentationName: leadRepresentationName,
    setShow: setShow,
    activity: activity,
    opportunity: opportunity,
    handleSuccess: handleSuccess,
    callerSource,
    isModalLoading: isLoading,
    leadTypeInternalName: leadTypeInternalName,
    enableTestEmailFeature: enableTestEmailFeature
  });
  const { options, reset } = useSendEmailStore();

  useEffect(() => {
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContent = (): JSX.Element => {
    if (options?.showSuccessMessage) {
      return <SuccessMessage message={options.successMessage ?? DEFAULT_SUCCESS_MESSAGE} />;
    }
    return (
      <>
        <Header />
        <Body callerSource={callerSource} />
        <Footer
          onSend={handleEmailSend}
          onTemplateSave={handleTemplateSave}
          validateEmailData={validateEmailData}
          callerSource={callerSource}
          enableTestEmailFeature={enableTestEmailFeature}
          leadTypeInternalName={leadTypeInternalName}
        />
      </>
    );
  };

  return (
    <SideModal
      show={show}
      setShow={setShow}
      customStyleClass={`${styles.modal} ${customStyleClass}`}>
      {getContent()}
    </SideModal>
  );
};

SendEmail.defaultProps = {
  customStyleClass: undefined,
  activity: undefined,
  opportunity: undefined,
  handleSuccess: undefined
};

export default SendEmail;
