import { IIcon } from '../custom-icon.types';
import { ReactNode } from 'react';

const NoChannel = (props: IIcon): ReactNode => {
  const { className, type } = props;
  if (type === 'outline') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11 12.0002C11 12.8287 10.3284 13.5002 9.5 13.5002L5.5 13.5002C4.67157 13.5002 4 12.8287 4 12.0002C4 11.1718 4.67157 10.5002 5.5 10.5002L9.5 10.5002C10.3284 10.5002 11 11.1718 11 12.0002Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 12.0002C19.5 12.8287 18.8284 13.5002 18 13.5002L14.5 13.5002C13.6716 13.5002 13 12.8287 13 12.0002C13 11.1718 13.6716 10.5002 14.5 10.5002L18 10.5002C18.8284 10.5002 19.5 11.1718 19.5 12.0002Z"
        />
      </svg>
    );
  }
};

export default NoChannel;
