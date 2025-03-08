export interface IOptOut {
  className?: string;
}

const OptOut = (props: IOptOut): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8A7.9,7.9,0,0,1,5.69,7.1L16.9,18.31A7.9,7.9,0,0,1,12,20Zm6.31-3.1L7.1,5.69A7.9,7.9,0,0,1,12,4a8,8,0,0,1,8,8A7.9,7.9,0,0,1,18.31,16.9Z" />
    </svg>
  );
};

OptOut.defaultProps = {
  className: ''
};

export default OptOut;
