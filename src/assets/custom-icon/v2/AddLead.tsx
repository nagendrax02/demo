import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const AddLead = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 25" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 10.8076C13.3807 10.8076 14.5 9.68833 14.5 8.30762C14.5 6.92691 13.3807 5.80762 12 5.80762C10.6193 5.80762 9.5 6.92691 9.5 8.30762C9.5 9.68833 10.6193 10.8076 12 10.8076ZM12 12.3076C14.2091 12.3076 16 10.5168 16 8.30762C16 6.09848 14.2091 4.30762 12 4.30762C9.79086 4.30762 8 6.09848 8 8.30762C8 10.5168 9.79086 12.3076 12 12.3076Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.1595 15.025C7.64682 15.025 6.00829 18.1514 5.73778 19.631C5.66328 20.0384 5.27258 20.3083 4.86512 20.2338C4.45766 20.1593 4.18774 19.7686 4.26224 19.3612C4.62812 17.36 6.74433 13.525 12.1595 13.525C12.5737 13.525 12.9095 13.8608 12.9095 14.275C12.9095 14.6892 12.5737 15.025 12.1595 15.025Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.6082 17.5024C12.6082 17.0882 12.9439 16.7524 13.3582 16.7524H18.9999C19.4142 16.7524 19.7499 17.0882 19.7499 17.5024C19.7499 17.9167 19.4142 18.2524 18.9999 18.2524H13.3582C12.9439 18.2524 12.6082 17.9167 12.6082 17.5024Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.1792 13.9473C16.5934 13.9473 16.9292 14.2831 16.9292 14.6973L16.9292 20.3077C16.9292 20.7219 16.5934 21.0577 16.1792 21.0577C15.765 21.0577 15.4292 20.7219 15.4292 20.3077L15.4292 14.6973C15.4292 14.2831 15.765 13.9473 16.1792 13.9473Z"
        />
      </svg>
    );
};

AddLead.defaultProps = {
  className: ''
};

export default AddLead;
