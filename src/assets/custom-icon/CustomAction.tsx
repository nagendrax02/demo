export interface ICustomAction {
  className?: string;
}

const CustomAction = (props: ICustomAction): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path style={{ fill: 'none' }} d="M0,0H24V24H0Z" />
      <path d="M6.21,14,7.41,16a.31.31,0,0,0,.37.13l1.49-.6a4.24,4.24,0,0,0,1,.59l.22,1.59a.31.31,0,0,0,.3.25h2.4a.31.31,0,0,0,.3-.26l.22-1.59a4.45,4.45,0,0,0,1-.59l1.49.6a.31.31,0,0,0,.37-.13L17.79,14a.31.31,0,0,0-.07-.39l-1.27-1a3.77,3.77,0,0,0,0-.58,5.85,5.85,0,0,0,0-.59l1.27-1a.31.31,0,0,0,.07-.39L16.59,8a.31.31,0,0,0-.37-.13l-1.49.6a4.24,4.24,0,0,0-1-.59L13.5,6.25A.31.31,0,0,0,13.2,6H10.8a.31.31,0,0,0-.3.26l-.22,1.59a4.21,4.21,0,0,0-1,.58l-1.49-.6A.31.31,0,0,0,7.41,8L6.21,10a.31.31,0,0,0,.07.39l1.27,1a3.92,3.92,0,0,0,0,.59,5.85,5.85,0,0,0,0,.59l-1.27,1A.31.31,0,0,0,6.21,14ZM12,10.29A1.71,1.71,0,1,1,10.29,12,1.72,1.72,0,0,1,12,10.29ZM19,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3Zm0,16H5V5H19Z" />
    </svg>
  );
};

CustomAction.defaultProps = {
  className: ''
};

export default CustomAction;
