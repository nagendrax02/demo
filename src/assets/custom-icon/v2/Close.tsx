import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Close = ({ className, type }: IIcon): ReactNode => {
  if (type === 'outline') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 11" fill="none" className={className}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.60828 0.891387C9.85236 1.13546 9.85236 1.53119 9.60828 1.77527L1.27495 10.1086C1.03087 10.3527 0.635144 10.3527 0.391066 10.1086C0.146988 9.86453 0.146988 9.4688 0.391066 9.22472L8.7244 0.891387C8.96848 0.647309 9.36421 0.647309 9.60828 0.891387Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.60796 10.1086C9.36388 10.3527 8.96815 10.3527 8.72407 10.1086L0.39074 1.77527C0.146663 1.53119 0.146663 1.13546 0.39074 0.891386C0.634818 0.647308 1.03055 0.647308 1.27462 0.891386L9.60796 9.22472C9.85203 9.4688 9.85203 9.86453 9.60796 10.1086Z"
        />
      </svg>
    );
  }
};

export default Close;
