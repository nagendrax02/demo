import { IIcon } from '../custom-icon.types';

const ArrowDown = (props: IIcon): JSX.Element | null => {
  const { type, className } = props;

  if (type === 'outline') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className={className}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.97979 6.31295C5.17505 6.11769 5.49163 6.11769 5.6869 6.31295L8.00001 8.62606L10.3131 6.31295C10.5084 6.11769 10.825 6.11769 11.0202 6.31295C11.2155 6.50821 11.2155 6.8248 11.0202 7.02006L8.35356 9.68672C8.1583 9.88199 7.84172 9.88199 7.64646 9.68672L4.97979 7.02006C4.78453 6.8248 4.78453 6.50821 4.97979 6.31295Z"
        />
      </svg>
    );
  } else if (type === 'filled') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.11612 9.11612C7.60427 8.62796 8.39573 8.62796 8.88388 9.11612L12 12.2322L15.1161 9.11612C15.6043 8.62796 16.3957 8.62796 16.8839 9.11612C17.372 9.60427 17.372 10.3957 16.8839 10.8839L12.8839 14.8839C12.3957 15.372 11.6043 15.372 11.1161 14.8839L7.11612 10.8839C6.62796 10.3957 6.62796 9.60427 7.11612 9.11612Z"
        />
      </svg>
    );
  }
  return null;
};

export default ArrowDown;
