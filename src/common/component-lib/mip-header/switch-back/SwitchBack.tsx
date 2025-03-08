import { trackError } from 'common/utils/experience/utils/track-error';
import React, { Suspense, useRef } from 'react';
import { useState } from 'react';
import MiPFeedback from '../mip-feedback/MiPFeedback';
import { onActionModalClose, useMiPHeader } from '../mip-header.store';
import { IOnSubmitConfig } from '../mip-feedback/MiPFeedback.types';
const Confirmation = React.lazy(() => import('../mip-feedback/components/Confirmation'));

const SwitchBack = (): JSX.Element => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(true);
  const module = useMiPHeader((state) => state.module);
  const submittedFeedback = useRef<IOnSubmitConfig>({} as IOnSubmitConfig);

  const onConfirmationSave = async (): Promise<void> => {
    try {
      const switchBackUtil = await import('./handle-switch-back');

      switchBackUtil.logEvent({
        submittedFeedback: submittedFeedback.current,
        switchedBack: true,
        event: 'sw-lite-switch-to-platform',
        experience: 'sw-lite-switch-to-platform'
      });

      setTimeout(() => {
        switchBackUtil.handleSwitchBack(module);
      }, 0);
    } catch (error) {
      trackError(error);
    }
  };

  const feedBackSubmit = (data?: IOnSubmitConfig): void => {
    setShowFeedbackModal(false);
    setShowConfirmation(true);
    submittedFeedback.current = (data || {}) as IOnSubmitConfig;
  };

  const onFeedbackModalClose = (): void => {
    onActionModalClose();
    setShowFeedbackModal(false);
    onActionModalClose();
  };

  const onConfirmationModalClose = async (): Promise<void> => {
    try {
      const switchBackUtil = await import('./handle-switch-back');
      switchBackUtil.logEvent({
        submittedFeedback: submittedFeedback.current,
        switchedBack: false,
        event: 'sw-lite-switch-to-platform',
        experience: 'sw-lite-switch-to-platform'
      });
      setShowConfirmation(false);
      onActionModalClose();
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <div>
      {showFeedbackModal ? (
        <MiPFeedback
          showFeedbackModal={showFeedbackModal}
          onClose={onFeedbackModalClose}
          onSubmit={feedBackSubmit}
        />
      ) : null}
      {showConfirmation ? (
        <Suspense fallback={<></>}>
          <Confirmation onClose={onConfirmationModalClose} onSubmit={onConfirmationSave} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default SwitchBack;
