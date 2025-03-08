import { FeedbackError, InputId } from '../MiPFeedback.types';
import styled from '../feedback.module.css';
import { handleFeedbackDescription, useMiPFeedBack } from '../mip-feedback.store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

const FeedbackTextArea = (): JSX.Element => {
  const textAreaValue = useMiPFeedBack((state) => state.feedbackDescription);
  const errorElement = useMiPFeedBack((state) => state.error);
  return (
    <div className={styled.text_area_wrapper}>
      <TextArea
        message={textAreaValue}
        handleMessageChange={(e): void => {
          handleFeedbackDescription(e?.target?.value?.trim() || '');
        }}
        placeholder="Describe your issue here so that we can fix it for you ASAP"
        id={InputId.FeedbackDescription}
        error={errorElement === FeedbackError.FeedBackDesc}
      />
    </div>
  );
};

export default FeedbackTextArea;
