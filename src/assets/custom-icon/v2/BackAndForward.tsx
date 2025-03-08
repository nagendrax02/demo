import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const BackAndForward = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg className={className} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.4421 5.39107C10.6862 5.63514 10.6862 6.03087 10.4421 6.27495L7.34238 9.37467H14.1668C14.512 9.37467 14.7918 9.6545 14.7918 9.99967C14.7918 10.3449 14.512 10.6247 14.1668 10.6247H7.34238L10.4421 13.7244C10.6862 13.9685 10.6862 14.3642 10.4421 14.6083C10.198 14.8524 9.8023 14.8524 9.55822 14.6083L5.39155 10.4416C5.14748 10.1975 5.14748 9.80181 5.39155 9.55773L9.55822 5.39107C9.8023 5.14699 10.198 5.14699 10.4421 5.39107Z"
          fill="#27313F"
        />
      </svg>
    );
};

BackAndForward.defaultProps = {
  className: ''
};

export default BackAndForward;
