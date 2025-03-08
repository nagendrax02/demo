export interface IChangeOwner {
  className?: string;
}

const ChangeOwner = (props: IChangeOwner): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path d="M12,8.27a2.23,2.23,0,1,0,2.22,2.23A2.22,2.22,0,0,0,12,8.27Zm0,3a.77.77,0,1,1,.78-.77A.77.77,0,0,1,12,11.27Z" />
      <path d="M12,5.88A6.12,6.12,0,1,0,18.12,12,6.12,6.12,0,0,0,12,5.88Zm0,9a4.47,4.47,0,0,1,2.79.91,4.65,4.65,0,0,1-5.58,0A4.52,4.52,0,0,1,12,14.83Zm0-1.45A6.06,6.06,0,0,0,8.19,14.7,4.61,4.61,0,0,1,7.33,12a4.67,4.67,0,0,1,9.34,0,4.61,4.61,0,0,1-.86,2.7A6.06,6.06,0,0,0,12,13.38Z" />
      <path d="M12,1.25A10.82,10.82,0,0,0,6.56,2.74L5.33,1.16,4.86,5l3.83.48L7.5,3.94A9.21,9.21,0,0,1,18.61,5.52l1.07-1A10.72,10.72,0,0,0,12,1.25Z" />
      <path d="M19,19.14l-3.83-.55,1.17,1.56A9.2,9.2,0,0,1,5.53,18.61L4.47,19.68a10.71,10.71,0,0,0,12.78,1.68L18.45,23Z" />
      <rect width="24" height="24" style={{ fill: 'none' }} />
    </svg>
  );
};

ChangeOwner.defaultProps = {
  className: ''
};

export default ChangeOwner;
