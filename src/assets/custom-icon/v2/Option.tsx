import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Option = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 25" fill="none">
        <circle cx="12" cy="7.15381" r="1.5" />
        <circle cx="12" cy="12.1538" r="1.5" />
        <circle cx="12" cy="17.1538" r="1.5" />
      </svg>
    );
};

Option.defaultProps = {
  className: ''
};

export default Option;
