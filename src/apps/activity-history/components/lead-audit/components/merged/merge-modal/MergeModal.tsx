export interface IMergeModal {
  show: boolean;
  setShow: (open: boolean) => void;
  prospectAuditId: string;
}

const MergeModal = (props: IMergeModal): JSX.Element | null => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { show, setShow, prospectAuditId } = props;

  // TODO: MERGE MODAL
  return <></>;
};

export default MergeModal;
