interface IOpportunity {
  className?: string;
}

const Opportunity = (props: IOpportunity): JSX.Element => {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      data-testid="opportunity-icon">
      <g transform="translate(-12.338 -12.338)">
        <g transform="translate(12.338 12.338)">
          <g transform="translate(1.578 1.878)">
            <path
              className="b"
              d="M24.238,22.46a5.878,5.878,0,1,0,5.878,5.878A5.878,5.878,0,0,0,24.238,22.46Zm0,10.256a4.377,4.377,0,1,1,4.377-4.377,4.377,4.377,0,0,1-4.377,4.377Z"
              transform="translate(-13.816 -13.943)"
            />
            <path
              className="b"
              d="M23.41,16.823v5.024h1.5V16.823l2.137,2.137,1.042-1.042L24.671,14.5a.75.75,0,0,0-1.042,0L20.21,17.917l1.042,1.042Z"
              transform="translate(-13.738 -14.288)"
            />
            <path
              className="b"
              d="M33.5,18.1H28.662v1.5h3.012L28.13,23.207l1.042,1.042L32.726,20.7v3.022h1.522V18.85A.75.75,0,0,0,33.5,18.1Z"
              transform="translate(-13.403 -14.127)"
            />
            <path
              className="b"
              d="M19.055,24.249,20.1,23.207l-3.544-3.554h3.012V18.1H14.75a.75.75,0,0,0-.75.75v4.836h1.5V20.664Z"
              transform="translate(-14 -14.127)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

Opportunity.defaultProps = {
  className: ''
};

export default Opportunity;
