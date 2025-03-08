import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const StatusIcon = ({ className, type, style }: IIcon): ReactNode => {
  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none" className={className}>
        <ellipse cx="7.00001" cy="6.82048" rx="2.91667" ry="2.91667" style={style} />
      </svg>
    );
};

export default StatusIcon;
