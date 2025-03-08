import FormField from 'src/common/component-lib/form-field';
import Modal from '@lsq/nextgen-preact/modal';
import { reasonTitle } from '../constant';
import Reason from './Reason';
import WorkAreas from './WorkAreas';
import { useMiPHeader } from '../../mip-header.store';
import { useMiPFeedBack } from '../mip-feedback.store';
import FeedbackTextArea from './FeedbackTextArea';
import { FeedbackError } from '../MiPFeedback.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const Body = (): JSX.Element => {
  const clickedAction = useMiPHeader((state) => state.clickedAction) || '';
  const errorElement = useMiPFeedBack((state) => state.error);
  const selectedReason = useMiPFeedBack((state) => state.reason);
  const errorMessage = 'Please select an option above';

  const getWorkAreas = (): JSX.Element => {
    if (selectedReason?.value && !selectedReason?.hideWorkArea) {
      return (
        <FormField
          title="Select where you faced the issue"
          required
          suspenseFallback={<Shimmer height="32px" width="100%" />}
          errorMessage={errorElement === FeedbackError.WorkArea ? errorMessage : undefined}>
          <WorkAreas />
        </FormField>
      );
    }
    return <></>;
  };

  const getFeedbackTextArea = (): JSX.Element => {
    if (selectedReason?.value) {
      return (
        <FormField
          title="Describe your issue or share your feedback below"
          required
          suspenseFallback={<Shimmer height="32px" width="100%" />}
          errorMessage={errorElement === FeedbackError.FeedBackDesc ? 'Required' : undefined}>
          <FeedbackTextArea />
        </FormField>
      );
    }
    return <></>;
  };

  return (
    <Modal.Body>
      <>
        <FormField
          title={reasonTitle[clickedAction] as string}
          required
          errorMessage={errorElement === FeedbackError.Reason ? errorMessage : undefined}
          suspenseFallback={<Shimmer height="32px" width="100%" />}>
          <Reason />
        </FormField>
        <>
          {getWorkAreas()}
          {getFeedbackTextArea()}
        </>
      </>
    </Modal.Body>
  );
};

export default Body;
