import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const EmailChannel = ({ className, type }: IIcon): ReactNode => {
  if (type === 'filled') {
    return (
      <svg className={className} viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 3.05965V11.5004C0 12.605 0.89543 13.5004 2 13.5004H16C17.1046 13.5004 18 12.605 18 11.5004V2.55957C17.9739 2.58289 17.9458 2.60466 17.9158 2.62464L9.65819 8.12464C9.42176 8.28211 9.11666 8.2925 8.87008 8.15147L0.127653 3.15147C0.0810964 3.12484 0.0384763 3.09398 0 3.05965Z" />
        <path
          opacity="0.5"
          d="M0.127686 1.53165C0.500033 1.69238 1.62769 2.46764 2.00003 2.62421L9.21246 6.61885L17 1.69238C17.4158 1.50898 17.9158 1.08491 17.9158 1.08491C17.6206 0.499944 17.2682 0.5 16 0.5H2.00003C1.1181 0.5 0.393634 0.739293 0.127686 1.53165Z"
        />
      </svg>
    );
  }
};

export default EmailChannel;
