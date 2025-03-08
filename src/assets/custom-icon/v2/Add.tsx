import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Add = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 25" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.7502 12.3076C18.7502 12.7218 18.4145 13.0576 18.0002 13.0576H6.00024C5.58603 13.0576 5.25024 12.7218 5.25024 12.3076C5.25024 11.8934 5.58603 11.5576 6.00024 11.5576H18.0002C18.4145 11.5576 18.7502 11.8934 18.7502 12.3076Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0001 19.0576C11.5859 19.0576 11.2501 18.7218 11.2501 18.3076L11.2501 6.30762C11.2501 5.8934 11.5859 5.55762 12.0001 5.55762C12.4143 5.55762 12.7501 5.8934 12.7501 6.30762L12.7501 18.3076C12.7501 18.7218 12.4143 19.0576 12.0001 19.0576Z"
        />
      </svg>
    );
};

Add.defaultProps = {
  className: ''
};

export default Add;
