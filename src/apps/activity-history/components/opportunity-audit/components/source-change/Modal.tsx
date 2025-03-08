import Table from '@lsq/nextgen-preact/table';
import Modal from '@lsq/nextgen-preact/modal';
import { Variant } from 'common/types';
import { IModal } from './source-change.types';
import { getColumnConfig } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const SourceChange = ({ showModal, setShowModal, sourceChangeData }: IModal): JSX.Element => {
  const { title = '', data, isOldAndNewValueSame } = sourceChangeData || {};

  const onClick = (): void => {
    setShowModal(false);
  };

  const tableRows = data?.map((field) => {
    return (
      <Table.Row
        key={field?.DisplayName as string}
        rowData={field as unknown as Record<string, string>}
      />
    );
  });

  return (
    <Modal show={showModal}>
      <Modal.Header title={title} onClose={onClick} />
      <Modal.Body>
        <Table columns={getColumnConfig(isOldAndNewValueSame)}>{tableRows as JSX.Element[]}</Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClick} variant={Variant.Secondary} text={'Close'} />
      </Modal.Footer>
    </Modal>
  );
};

export default SourceChange;
