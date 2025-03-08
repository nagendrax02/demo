export interface IChangeStage {
  className?: string;
}

const ChangeStage = (props: IChangeStage): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path d="M7,4v7h6v6h7v3H4V4H7M9,2H2V22H22V15H15V9H9V2Z" />
      <polygon points="22 8 22 2 16 2 16 0.41 12 3 16 5.59 16 4 20 4 20 8 18.51 8 21 12 23.49 8 22 8" />
      <rect width="24" height="24" style={{ fill: 'none' }} />
    </svg>
  );
};

ChangeStage.defaultProps = {
  className: ''
};

export default ChangeStage;
