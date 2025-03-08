import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

import { Variant } from 'common/types';
import { createPortal } from 'react-dom';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

interface ITabModal {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  maxAllowedTabs: number;
}

const TabModal = (props: ITabModal): JSX.Element => {
  const { show, setShow, maxAllowedTabs } = props;

  return createPortal(
    <ConfirmationModal
      onClose={() => {
        setShow(false);
      }}
      show={show}
      title="Limit Reached!"
      description={`You can not add more than ${maxAllowedTabs} Smart View tabs.Please contact your Administrator.`}
      buttonConfig={[
        {
          id: 1,
          name: 'Ok',
          variant: Variant.Primary,
          onClick: (): void => {
            setShow(false);
          }
        }
      ]}
    />,
    document.body
  );
};

export default TabModal;
