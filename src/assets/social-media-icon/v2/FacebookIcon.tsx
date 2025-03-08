import { ReactNode } from 'react';
import { IIcon } from 'assets/custom-icon/custom-icon.types';

const FacebookIcon = (props: IIcon): ReactNode => {
  const { className, type = 'outline', dataTestId } = props;
  if (type === 'filled') {
    return (
      <svg
        className={className}
        data-testid={dataTestId}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.35 21.9C5.6 21.05 2 16.95 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 16.95 18.4 21.05 13.65 21.9L13.1 21.45H10.9L10.35 21.9Z"
          fill="url(#paint0_linear_3465_23907)"
        />
        <path
          d="M15.9 14.8L16.35 12H13.7V10.05C13.7 9.25 14 8.65 15.2 8.65H16.5V6.1C15.8 6 15 5.9 14.3 5.9C12 5.9 10.4 7.3 10.4 9.8V12H7.9V14.8H10.4V21.85C10.95 21.95 11.5 22 12.05 22C12.6 22 13.15 21.95 13.7 21.85V14.8H15.9Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3465_23907"
            x1="12.0005"
            y1="21.4015"
            x2="12.0005"
            y2="1.9963"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#0062E0" />
            <stop offset="1" stopColor="#19AFFF" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
};

export default FacebookIcon;
