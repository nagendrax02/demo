import { ReactNode } from 'react';
import { IIcon } from './custom-icon.types';

const AddEmptyList = (props: IIcon): ReactNode => {
  const { className, type } = props;
  if (type === 'outline')
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={className}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.1667 3.75H6.66675C5.97639 3.75 5.41675 4.30964 5.41675 5V15C5.41675 15.6904 5.97639 16.25 6.66675 16.25H9.62508C9.97026 16.25 10.2501 16.5298 10.2501 16.875C10.2501 17.2202 9.97026 17.5 9.62508 17.5H6.66675C5.28604 17.5 4.16675 16.3807 4.16675 15V5C4.16675 3.61929 5.28604 2.5 6.66675 2.5H14.1667C15.5475 2.5 16.6667 3.61929 16.6667 5V9.625C16.6667 9.97018 16.3869 10.25 16.0417 10.25C15.6966 10.25 15.4167 9.97018 15.4167 9.625V5C15.4167 4.30964 14.8571 3.75 14.1667 3.75Z"
          fill="#303DB1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.58342 13.9583C9.58342 13.6132 9.86324 13.3333 10.2084 13.3333H16.0417C16.3869 13.3333 16.6667 13.6132 16.6667 13.9583C16.6667 14.3035 16.3869 14.5833 16.0417 14.5833H10.2084C9.86324 14.5833 9.58342 14.3035 9.58342 13.9583Z"
          fill="#303DB1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.1251 10.4167C13.4703 10.4167 13.7501 10.6965 13.7501 11.0417V16.875C13.7501 17.2202 13.4703 17.5 13.1251 17.5C12.7799 17.5 12.5001 17.2202 12.5001 16.875V11.0417C12.5001 10.6965 12.7799 10.4167 13.1251 10.4167Z"
          fill="#303DB1"
        />
      </svg>
    );
};

AddEmptyList.defaultProps = {
  className: ''
};

export default AddEmptyList;
