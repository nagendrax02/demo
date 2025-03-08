interface IGeneric {
  width?: string;
  height?: string;
  color?: string;
}

const Generic = (props: IGeneric): JSX.Element => {
  const { width, height, color } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '24'}
      height={height || '24'}
      viewBox="0 0 24 24"
      fill="none">
      <g clipPath="url(#clip0_2910_13174)">
        <path
          d="M6 2C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13Z"
          fill={color || '#4AA7EA'}
        />
      </g>
      <defs>
        <clipPath id="clip0_2910_13174">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

Generic.defaultProps = {
  width: '24',
  height: '24',
  color: '#4AA7EA'
};

export default Generic;
