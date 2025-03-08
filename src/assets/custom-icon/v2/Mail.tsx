import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Mail = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 18 14" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2.30762H2C1.72386 2.30762 1.5 2.53147 1.5 2.80762V11.8076C1.5 12.0838 1.72386 12.3076 2 12.3076H16C16.2761 12.3076 16.5 12.0838 16.5 11.8076V2.80762C16.5 2.53147 16.2761 2.30762 16 2.30762ZM2 0.807617C0.895431 0.807617 0 1.70305 0 2.80762V11.8076C0 12.9122 0.89543 13.8076 2 13.8076H16C17.1046 13.8076 18 12.9122 18 11.8076V2.80762C18 1.70305 17.1046 0.807617 16 0.807617H2Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.35887 2.41874C0.573702 2.06459 1.03495 1.95166 1.3891 2.16649L9.23048 6.92321L16.5938 2.17732C16.942 1.95292 17.4061 2.05325 17.6305 2.40141C17.8549 2.74957 17.7546 3.21373 17.4064 3.43813L9.64885 8.43813C9.40765 8.59359 9.09889 8.5978 8.85355 8.44897L0.611122 3.44897C0.256975 3.23414 0.144038 2.77289 0.35887 2.41874Z"
        />
      </svg>
    );
};

Mail.defaultProps = {
  className: ''
};

export default Mail;
