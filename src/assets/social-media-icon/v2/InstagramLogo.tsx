import { ReactNode } from 'react';
import { IIcon } from 'assets/custom-icon/custom-icon.types';

const InstagramLogo = (props: IIcon): ReactNode => {
  const { className, type } = props;
  if (type === 'filled') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.375 3H8.625C7.13316 3 5.70242 3.59263 4.64752 4.64752C3.59263 5.70242 3 7.13316 3 8.625V15.375C3 16.8668 3.59263 18.2976 4.64752 19.3525C5.70242 20.4074 7.13316 21 8.625 21H15.375C16.8668 21 18.2976 20.4074 19.3525 19.3525C20.4074 18.2976 21 16.8668 21 15.375V8.625C21 7.13316 20.4074 5.70242 19.3525 4.64752C18.2976 3.59263 16.8668 3 15.375 3ZM19.3125 15.375C19.3125 17.5462 17.5462 19.3125 15.375 19.3125H8.625C6.45375 19.3125 4.6875 17.5462 4.6875 15.375V8.625C4.6875 6.45375 6.45375 4.6875 8.625 4.6875H15.375C17.5462 4.6875 19.3125 6.45375 19.3125 8.625V15.375Z"
          fill="url(#paint0_linear_3465_23898)"
        />
        <path
          d="M12 7.5C10.8065 7.5 9.66193 7.97411 8.81802 8.81802C7.97411 9.66193 7.5 10.8065 7.5 12C7.5 13.1935 7.97411 14.3381 8.81802 15.182C9.66193 16.0259 10.8065 16.5 12 16.5C13.1935 16.5 14.3381 16.0259 15.182 15.182C16.0259 14.3381 16.5 13.1935 16.5 12C16.5 10.8065 16.0259 9.66193 15.182 8.81802C14.3381 7.97411 13.1935 7.5 12 7.5ZM12 14.8125C11.2544 14.8116 10.5395 14.515 10.0122 13.9878C9.485 13.4605 9.18839 12.7456 9.1875 12C9.1875 10.4486 10.4497 9.1875 12 9.1875C13.5503 9.1875 14.8125 10.4486 14.8125 12C14.8125 13.5503 13.5503 14.8125 12 14.8125Z"
          fill="url(#paint1_linear_3465_23898)"
        />
        <path
          d="M16.8375 7.76213C17.1687 7.76213 17.4371 7.49366 17.4371 7.1625C17.4371 6.83134 17.1687 6.56288 16.8375 6.56288C16.5063 6.56288 16.2379 6.83134 16.2379 7.1625C16.2379 7.49366 16.5063 7.76213 16.8375 7.76213Z"
          fill="url(#paint2_linear_3465_23898)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3465_23898"
            x1="4.647"
            y1="19.353"
            x2="19.353"
            y2="4.647"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC107" />
            <stop offset="0.507" stopColor="#F44336" />
            <stop offset="0.99" stopColor="#9C27B0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3465_23898"
            x1="5.637"
            y1="18.363"
            x2="18.363"
            y2="5.637"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC107" />
            <stop offset="0.507" stopColor="#F44336" />
            <stop offset="0.99" stopColor="#9C27B0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3465_23898"
            x1="16.4118"
            y1="7.58662"
            x2="17.2601"
            y2="6.73837"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC107" />
            <stop offset="0.507" stopColor="#F44336" />
            <stop offset="0.99" stopColor="#9C27B0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
};

export default InstagramLogo;
