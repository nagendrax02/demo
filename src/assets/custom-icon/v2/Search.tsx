import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Search = (props: IIcon): ReactNode => {
  const { className, type } = props;
  if (type === 'outline') {
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.27051 9.22949C7.34158 9.22949 9.02051 7.55056 9.02051 5.47949C9.02051 3.40842 7.34158 1.72949 5.27051 1.72949C3.19944 1.72949 1.52051 3.40842 1.52051 5.47949C1.52051 7.55056 3.19944 9.22949 5.27051 9.22949ZM5.27051 10.4795C8.03193 10.4795 10.2705 8.24092 10.2705 5.47949C10.2705 2.71807 8.03193 0.479492 5.27051 0.479492C2.50908 0.479492 0.270508 2.71807 0.270508 5.47949C0.270508 8.24092 2.50908 10.4795 5.27051 10.4795Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.16157 7.95454C8.40565 7.71046 8.80138 7.71046 9.04546 7.95454L11.5455 10.4545C11.7895 10.6986 11.7895 11.0943 11.5455 11.3384C11.3014 11.5825 10.9057 11.5825 10.6616 11.3384L8.16157 8.83843C7.9175 8.59435 7.9175 8.19862 8.16157 7.95454Z"
        />
      </svg>
    );
  }
};

export default Search;
