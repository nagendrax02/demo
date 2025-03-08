import { ReactNode } from 'react';
import { IIcon } from './social-media-icon.types';

const Skype = ({ className, dataTestId }: IIcon): ReactNode => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      data-testid={dataTestId}>
      <path
        d="M8.38854 13.7089C11.3645 13.7089 13.7771 11.3116 13.7771 8.35443C13.7771 5.39726 11.3645 3 8.38854 3C5.41253 3 3 5.39726 3 8.35443C3 11.3116 5.41253 13.7089 8.38854 13.7089Z"
        fill="url(#paint0_linear_9329_90070)"
      />
      <path
        d="M15.6115 21C18.5875 21 21 18.6027 21 15.6456C21 12.6884 18.5875 10.2911 15.6115 10.2911C12.6355 10.2911 10.2229 12.6884 10.2229 15.6456C10.2229 18.6027 12.6355 21 15.6115 21Z"
        fill="url(#paint1_linear_9329_90070)"
      />
      <path
        d="M12.0573 20.4304C16.6796 20.4304 20.4268 16.707 20.4268 12.1139C20.4268 7.52087 16.6796 3.79747 12.0573 3.79747C7.43502 3.79747 3.6879 7.52087 3.6879 12.1139C3.6879 16.707 7.43502 20.4304 12.0573 20.4304Z"
        fill="url(#paint2_linear_9329_90070)"
      />
      <path
        d="M11.756 16.8987C10.9584 16.8809 10.1657 16.8025 9.42037 16.4803C9.26784 16.4143 9.12169 16.3259 8.98859 16.2272C8.6771 15.9963 8.60052 15.6752 8.67367 15.3165C8.7321 15.0302 9.00218 14.8297 9.32326 14.8105C9.58854 14.7946 9.8327 14.8611 10.0698 14.9733C10.4716 15.1634 10.8687 15.3679 11.3182 15.4355C11.76 15.502 12.1996 15.5091 12.6273 15.3617C13.1639 15.1767 13.4403 14.7136 13.3318 14.198C13.2786 13.9452 13.116 13.7657 12.917 13.6125C12.5145 13.3027 12.043 13.1175 11.5844 12.9081C11.0273 12.6538 10.4647 12.4084 9.92292 12.1255C9.46048 11.8841 9.08132 11.5369 8.85442 11.0623C8.45654 10.23 8.48673 8.98999 9.52263 8.21908C10.0688 7.81264 10.6931 7.60817 11.3584 7.51007C12.2185 7.38323 13.0721 7.43541 13.9069 7.67508C14.1317 7.73961 14.3518 7.84586 14.5488 7.97093C14.8796 8.18093 14.9936 8.57354 14.865 8.93653C14.7358 9.30112 14.3264 9.47152 13.9209 9.3266C13.6366 9.22498 13.358 9.10643 13.0696 9.01791C12.5352 8.85392 11.9905 8.80631 11.4411 8.9475C11.3316 8.97563 11.224 9.01771 11.1223 9.06683C10.3933 9.41908 10.312 10.2421 10.98 10.6957C11.2787 10.8984 11.618 11.0491 11.9514 11.1967C12.6065 11.4866 13.2887 11.7187 13.9048 12.0906C14.4137 12.3979 14.8591 12.7722 15.0776 13.3294C15.5381 14.504 15.2088 16.0595 13.563 16.6259C12.9792 16.8268 12.3753 16.8891 11.756 16.8987Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9329_90070"
          x1="967.89"
          y1="1345.93"
          x2="529.824"
          y2="54.534"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#2497D3" />
          <stop offset="1" stopColor="#28A8EA" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_9329_90070"
          x1="1824.11"
          y1="1803"
          x2="223.5"
          y2="117.282"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#28A8EA" />
          <stop offset="1" stopColor="#28A8EA" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_9329_90070"
          x1="299.028"
          y1="156.756"
          x2="1533.29"
          y2="1615.1"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#28A8EA" />
          <stop offset="1" stopColor="#00B9FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Skype;
