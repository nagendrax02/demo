import { ReactNode } from 'react';
import { IIcon } from './social-media-icon.types';

const Twitter = ({ className, dataTestId }: IIcon): ReactNode => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      data-testid={dataTestId}>
      <path
        d="M5.33333 2C3.49238 2 2 3.49238 2 5.33333V18.6667C2 20.5076 3.49238 22 5.33333 22H18.6667C20.5076 22 22 20.5076 22 18.6667V5.33333C22 3.49238 20.5076 2 18.6667 2H5.33333ZM6.32664 6.28571H10.1064L12.7906 10.0999L16.0476 6.28571H17.2381L13.3281 10.8635L18.1496 17.7143H14.3707L11.256 13.2891L7.47619 17.7143H6.28571L10.7184 12.5255L6.32664 6.28571ZM8.14955 7.2381L14.8674 16.7619H16.3266L9.60882 7.2381H8.14955Z"
        fill="black"
      />
    </svg>
  );
};

export default Twitter;
