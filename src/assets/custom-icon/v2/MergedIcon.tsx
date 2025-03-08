import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const MergedIcon = ({ className, type, style }: IIcon): ReactNode => {
  if (type === 'outline') {
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 20 21"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.4167 5.29199C10.7618 5.29199 11.0417 5.57181 11.0417 5.91699V12.0465L6.22911 15.984C5.96195 16.2026 5.56819 16.1633 5.34961 15.8961C5.13103 15.6289 5.17041 15.2352 5.43756 15.0166L9.79167 11.4542V5.91699C9.79167 5.57181 10.0715 5.29199 10.4167 5.29199Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.4167 3.71777L13.8037 7.58866C14.031 7.84843 14.0047 8.24329 13.7449 8.47059C13.4851 8.69789 13.0903 8.67157 12.863 8.41179L10.4167 5.61601L7.97035 8.41179C7.74305 8.67157 7.3482 8.69789 7.08843 8.47059C6.82866 8.24329 6.80233 7.84843 7.02963 7.58866L10.4167 3.71777Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.6032 13.0169C11.8242 12.7517 12.2183 12.7159 12.4834 12.9369L14.9834 15.0202C15.2486 15.2412 15.2844 15.6353 15.0635 15.9005C14.8425 16.1656 14.4484 16.2015 14.1832 15.9805L11.6832 13.8971C11.418 13.6762 11.3822 13.2821 11.6032 13.0169Z"
        />
      </svg>
    );
  }
};

export default MergedIcon;
