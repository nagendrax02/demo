interface IZip {
  width?: string;
  height?: string;
}

const Zip = (props: IZip): JSX.Element => {
  const { width, height } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '24'}
      height={height || '24'}
      viewBox="0 0 24 24"
      fill="none">
      <g clipPath="url(#clip0_2910_13184)">
        <path
          d="M20 6H12L10.59 4.59C10.21 4.21 9.7 4 9.17 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM18 12H16V14H18V16H16V18H14V16H16V14H14V12H16V10H14V8H16V10H18V12Z"
          fill={'#F5B129'}
        />
      </g>
      <defs>
        <clipPath id="clip0_2910_13184">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

Zip.defaultProps = {
  width: '24',
  height: '24'
};

export default Zip;
