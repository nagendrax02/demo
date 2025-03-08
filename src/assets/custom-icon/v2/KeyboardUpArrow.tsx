import { IIcon } from '../custom-icon.types';

const KeyboardUpArrow = (props: IIcon): React.ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.0202 9.68656C10.8249 9.88182 10.5083 9.88182 10.3131 9.68656L7.99996 7.37345L5.68685 9.68656C5.49158 9.88182 5.175 9.88182 4.97974 9.68656C4.78448 9.4913 4.78448 9.17472 4.97974 8.97945L7.64641 6.31279C7.84167 6.11753 8.15825 6.11753 8.35351 6.31279L11.0202 8.97945C11.2154 9.17472 11.2154 9.4913 11.0202 9.68656Z"
        />
      </svg>
    );
};

export default KeyboardUpArrow;
