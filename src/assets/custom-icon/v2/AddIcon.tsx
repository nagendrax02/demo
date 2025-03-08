import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const AddIcon = ({ className, type }: IIcon): ReactNode => {
  if (type === 'outline') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="none" className={className}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.5 5.00001C9.5 5.27615 9.27614 5.50001 9 5.50001H1C0.723858 5.50001 0.5 5.27615 0.5 5.00001C0.5 4.72386 0.723858 4.50001 1 4.50001H9C9.27614 4.50001 9.5 4.72386 9.5 5.00001Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.99992 9.5C4.72378 9.5 4.49992 9.27614 4.49992 9L4.49993 1C4.49993 0.723858 4.72378 0.5 4.99993 0.5C5.27607 0.5 5.49993 0.723858 5.49993 1L5.49992 9C5.49992 9.27614 5.27607 9.5 4.99992 9.5Z"
        />
      </svg>
    );
  }
};

export default AddIcon;
