export interface IEdit {
  className?: string;
}

const Edit = (props: IEdit): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path className="cls-1" d="M0,0H24V24H0Z" style={{ fill: 'none' }} />
      <path d="M14.06,9l.92.92L5.92,19H5v-.92L14.06,9m3.6-6a1,1,0,0,0-.7.29L15.13,5.12l3.75,3.75L20.71,7a1,1,0,0,0,0-1.41L18.37,3.29A1,1,0,0,0,17.66,3Zm-3.6,3.19L3,17.25V21H6.75L17.81,9.94Z" />
    </svg>
  );
};

Edit.defaultProps = {
  className: ''
};

export default Edit;
