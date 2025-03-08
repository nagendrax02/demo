import { ReactNode } from 'react';

export interface ILeadsquaredLogoIcon {
  className?: string;
}

const LeadsquaredLogoIcon = ({ className }: ILeadsquaredLogoIcon): ReactNode => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" fill="none" className={className}>
      <path
        d="M2 -7.43866e-05C0.895429 -7.43866e-05 0 0.895357 0 1.99993V10.083H9.36532C9.9176 10.083 10.3653 10.5307 10.3653 11.083V20.3076H18.64C19.7446 20.3076 20.64 19.4122 20.64 18.3076V1.99993C20.64 0.895359 19.7446 -7.43866e-05 18.64 -7.43866e-05H2Z"
        fill="#276FFF"
      />
      <path
        d="M10.32 20.3076H2C0.895429 20.3076 0 19.4122 0 18.3076V10.1869L10.32 20.3076Z"
        fill="#27313F"
      />
    </svg>
  );
};

LeadsquaredLogoIcon.defaultProps = {
  className: ''
};

export default LeadsquaredLogoIcon;
