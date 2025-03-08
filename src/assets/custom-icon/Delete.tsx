export interface IDelete {
  className?: string;
}

const Delete = (props: IDelete): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path style={{ fill: 'none' }} d="M0,0H24V24H0Z" />
      <path d="M16,9V19H8V9h8M14.5,3h-5l-1,1H5V6H19V4H15.5ZM18,7H6V19a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2Z" />
    </svg>
  );
};

Delete.defaultProps = {
  className: ''
};

export default Delete;
