import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Time = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg className={className} viewBox="0 0 12 13" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 11C8.48528 11 10.5 8.98528 10.5 6.5C10.5 4.01472 8.48528 2 6 2C3.51472 2 1.5 4.01472 1.5 6.5C1.5 8.98528 3.51472 11 6 11ZM6.375 4.5C6.375 4.29289 6.20711 4.125 6 4.125C5.79289 4.125 5.625 4.29289 5.625 4.5V6.75C5.625 6.84946 5.66451 6.94484 5.73484 7.01517L6.73483 8.01517C6.88128 8.16161 7.11872 8.16161 7.26517 8.01517C7.41161 7.86872 7.41161 7.63128 7.26517 7.48483L6.375 6.59467V4.5Z"
          fill="#B9C5D4"
        />
      </svg>
    );
};

Time.defaultProps = {
  className: ''
};

export default Time;
