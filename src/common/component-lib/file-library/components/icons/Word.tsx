import { IIcon } from '../../file-library.types';

const Word = (props: IIcon): JSX.Element => {
  const { width, height, color } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '24'}
      height={height || '24'}
      viewBox="0 0 24 24"
      fill="none">
      <g clipPath="url(#clip0_2040_943)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.11765 3C3.9481 3 3 3.9481 3 5.11765V18.8824C3 20.0519 3.9481 21 5.11765 21H18.8824C20.0519 21 21 20.0519 21 18.8824V5.11765C21 3.9481 20.0519 3 18.8824 3H5.11765ZM6 8L8.42283 16.4H10.2304L11.9429 10.7418H12.0444L13.7759 16.4H15.5708L18 8H16.0211L14.6068 14.0017H14.5053L12.8055 8H11.1882L9.52008 14.0017H9.4186L7.99154 8H6Z"
          fill={color || '#5788DD'}
        />
      </g>
      <defs>
        <clipPath id="clip0_2040_943">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Word;
