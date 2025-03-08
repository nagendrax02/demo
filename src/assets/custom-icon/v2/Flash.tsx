import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Flash = (props: IIcon): ReactNode => {
  const { type, className } = props;

  return type === 'outline' ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.33113 3.90371L4.89325 7.74596L7.64272 8.48268C8.07528 8.59859 8.30617 9.06952 8.13288 9.48245L7.05588 12.0489L11.2432 8.25588L8.70039 7.57454C8.26783 7.45864 8.03694 6.9877 8.21023 6.57477L9.33113 3.90371ZM9.51956 2.41785C10.1102 1.90644 10.987 2.54206 10.6847 3.26251L9.24803 6.686L11.9647 7.41393C12.53 7.56539 12.7033 8.28256 12.2695 8.67544L6.85695 13.5784C6.27118 14.109 5.37357 13.4735 5.6794 12.7447L7.09508 9.37122L4.15913 8.58453C3.58661 8.43113 3.41858 7.69999 3.86669 7.31203L9.51956 2.41785Z"
      />
    </svg>
  ) : null;
};

export default Flash;
