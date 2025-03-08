import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const SuccessTick = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'filled')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" fill="none" className={className}>
        <rect width="6" height="6" rx="3" />
        <path d="M1.5 2.8125L2.625 3.9375L4.5 2.0625" stroke="white" strokeLinecap="round" />
      </svg>
    );
};

SuccessTick.defaultProps = {
  className: ''
};

export default SuccessTick;
