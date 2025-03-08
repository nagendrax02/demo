export interface IAddOpportunity {
  className?: string;
}

const AddOpportunity = (props: IAddOpportunity): JSX.Element | null => {
  const { className } = props;
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}>
      <path id="Path_7182" data-name="Path 7182" style={{ fill: 'none' }} d="M0,0H24V24H0Z" />
      <path d="M11.29,4.55V9.37h1.44V4.55l2,2.05,1-1L12.5,2.32a.72.72,0,0,0-1,0L8.22,5.6l1,1Z" />
      <path d="M21.28,5.79H16.64V7.23h2.89l-3.4,3.46,1,1,3.41-3.41v2.9H22V6.51a.72.72,0,0,0-.72-.72Z" />
      <path d="M6.85,11.69l1-1L4.45,7.28H7.34V5.79H2.72A.72.72,0,0,0,2,6.51v4.64H3.44V8.25Z" />
      <path d="M13.86,20a4.2,4.2,0,1,1,1.71-5.93l1.16-.87A5.64,5.64,0,1,0,12,21.88a5.71,5.71,0,0,0,2.58-.62Z" />
      <polygon points="22 17.63 19.25 17.63 19.25 14.88 17.75 14.88 17.75 17.63 15 17.63 15 19.13 17.75 19.13 17.75 21.88 19.25 21.88 19.25 19.13 22 19.13 22 17.63" />
    </svg>
  );
};

AddOpportunity.defaultProps = {
  className: ''
};

export default AddOpportunity;
