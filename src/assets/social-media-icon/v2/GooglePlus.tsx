import { ReactNode } from 'react';
import { IIcon } from './social-media-icon.types';

const GooglePlus = ({ className, dataTestId }: IIcon): ReactNode => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      data-testid={dataTestId}>
      <path
        d="M12 2C9.34784 2 6.8043 3.05357 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C6.8043 20.9464 9.34784 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2Z"
        fill="#F4511E"
      />
      <path d="M17 9.5H18V13.5H17V9.5Z" fill="white" />
      <path
        d="M15.5 11H19.5V12H15.5V11ZM13.9075 11.1L13.8825 11H9.5V12.5H12.455C12.2165 13.9185 10.986 15 9.5 15C7.843 15 6.5 13.657 6.5 12C6.5 10.343 7.843 9 9.5 9C10.25 9 10.934 9.277 11.46 9.7325L12.5355 8.6795C11.7355 7.947 10.67 7.5 9.5 7.5C7.0145 7.5 5 9.5145 5 12C5 14.4855 7.0145 16.5 9.5 16.5C11.9855 16.5 14 14.4855 14 12C14 11.6915 13.967 11.391 13.9075 11.1Z"
        fill="white"
      />
    </svg>
  );
};

export default GooglePlus;
