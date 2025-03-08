import { IIcon } from '../../file-library.types';

const PDF = (props: IIcon): JSX.Element => {
  const { width, height, color } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '24'}
      height={height || '24'}
      viewBox="0 0 24 24"
      fill="none">
      <g clipPath="url(#clip0_2040_952)">
        <path
          d="M18.75 3H5.25C4.0125 3 3 4.0125 3 5.25V18.75C3 19.9875 4.0125 21 5.25 21H18.75C19.9875 21 21 19.9875 21 18.75V5.25C21 4.0125 19.9875 3 18.75 3ZM9.1875 11.4375C9.1875 12.3712 8.43375 13.125 7.5 13.125H6.375V15.375H4.6875V8.625H7.5C8.43375 8.625 9.1875 9.37875 9.1875 10.3125V11.4375ZM14.8125 13.6875C14.8125 14.6212 14.0587 15.375 13.125 15.375H10.3125V8.625H13.125C14.0587 8.625 14.8125 9.37875 14.8125 10.3125V13.6875ZM19.3125 10.3125H17.625V11.4375H19.3125V13.125H17.625V15.375H15.9375V8.625H19.3125V10.3125ZM6.375 11.4375H7.5V10.3125H6.375V11.4375ZM12 13.6875H13.125V10.3125H12V13.6875Z"
          fill={color || '#D95140'}
        />
      </g>
      <defs>
        <clipPath id="clip0_2040_952">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PDF;
