import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const ReturnIcon = (props: IIcon): ReactNode => {
  const { className, type } = props;
  if (type === 'outline') {
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
        <path
          d="M13.3333 2.66699V3.60033C13.3333 5.84054 13.3333 6.96064 12.8973 7.81629C12.5138 8.56894 11.9019 9.18086 11.1493 9.56435C10.2936 10.0003 9.1735 10.0003 6.93329 10.0003H2.66663M2.66663 10.0003L5.99996 6.66699M2.66663 10.0003L5.99996 13.3337"
          strokeWidth="1.11333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
};

export default ReturnIcon;
