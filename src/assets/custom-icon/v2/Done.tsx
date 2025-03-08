import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Done = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 25" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0607 8.24702C19.3536 8.53991 19.3536 9.01479 19.0607 9.30768L10.6339 17.7344C10.1458 18.2226 9.35433 18.2226 8.86617 17.7344L4.9394 13.8077C4.6465 13.5148 4.6465 13.0399 4.9394 12.747C5.23229 12.4541 5.70716 12.4541 6.00006 12.747L9.75006 16.497L18.0001 8.24702C18.293 7.95412 18.7678 7.95412 19.0607 8.24702Z"
        />
      </svg>
    );
};

Done.defaultProps = {
  className: ''
};

export default Done;
