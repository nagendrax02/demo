export interface ICall {
  className?: string;
}

const Call = (props: ICall): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path style={{ fill: 'none' }} d="M0,0H24V24H0Z" />
      <path d="M6.54,5A12.31,12.31,0,0,0,7,7.59l-1.2,1.2A14.83,14.83,0,0,1,5,5H6.54M16.4,17a12.75,12.75,0,0,0,2.6.45V19a15.43,15.43,0,0,1-3.8-.75L16.4,17M7.5,3H4A1,1,0,0,0,3,4,17,17,0,0,0,20,21a1,1,0,0,0,1-1V16.51a1,1,0,0,0-1-1,11.41,11.41,0,0,1-3.57-.57.84.84,0,0,0-.31,0,1,1,0,0,0-.71.29l-2.2,2.2a15.15,15.15,0,0,1-6.59-6.59l2.2-2.2a1,1,0,0,0,.25-1A11.36,11.36,0,0,1,8.5,4,1,1,0,0,0,7.5,3Z" />
    </svg>
  );
};

Call.defaultProps = {
  className: ''
};

export default Call;
