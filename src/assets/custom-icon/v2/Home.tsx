import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Home = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'duotone')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" className={className}>
        <path opacity="0.4" d="M9 13.5H16V21.12H9V13.5Z" />
        <path d="M14.6513 14.1904C14.5962 14.1708 14.5368 14.1601 14.475 14.1601H10.475C10.4134 14.1601 10.3542 14.1707 10.2993 14.1902C10.0589 14.2265 9.8746 14.434 9.8746 14.6846V21.1101H6.675C5.74992 21.1101 5 20.3601 5 19.435V11.975C5 11.5308 5.17647 11.1047 5.4906 10.7906L11.2906 4.9906C11.9447 4.33647 13.0053 4.33647 13.6594 4.9906L19.4594 10.7906C19.7735 11.1047 19.95 11.5308 19.95 11.975V19.4351C19.95 20.3601 19.2001 21.1101 18.275 21.1101H15.0746V14.6846C15.0746 14.4345 14.891 14.2273 14.6513 14.1904Z" />
      </svg>
    );
};

Home.defaultProps = {
  className: ''
};

export default Home;
