import { ReactNode } from 'react';
import { IIcon } from '../custom-icon.types';

const Information = (props: IIcon): ReactNode => {
  const { className, type } = props;

  if (type === 'outline')
    return (
      <svg className={className} viewBox="0 0 16 17" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 369">
          <path
            id="Ellipse 506 (Stroke)"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 14.8076C11.5899 14.8076 14.5 11.8975 14.5 8.30762C14.5 4.71777 11.5899 1.80762 8 1.80762C4.41015 1.80762 1.5 4.71777 1.5 8.30762C1.5 11.8975 4.41015 14.8076 8 14.8076ZM8 16.3076C12.4183 16.3076 16 12.7259 16 8.30762C16 3.88934 12.4183 0.307617 8 0.307617C3.58172 0.307617 0 3.88934 0 8.30762C0 12.7259 3.58172 16.3076 8 16.3076Z"
            fill="#27313F"
          />
          <path
            id="Vector 158 (Stroke)"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 3.55762C8.41421 3.55762 8.75 3.8934 8.75 4.30762V4.80762C8.75 5.22183 8.41421 5.55762 8 5.55762C7.58579 5.55762 7.25 5.22183 7.25 4.80762V4.30762C7.25 3.8934 7.58579 3.55762 8 3.55762Z"
            fill="#27313F"
          />
          <path
            id="Vector 159 (Stroke)"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 6.55762C8.41421 6.55762 8.75 6.8934 8.75 7.30762V11.3076C8.75 11.7218 8.41421 12.0576 8 12.0576C7.58579 12.0576 7.25 11.7218 7.25 11.3076V7.30762C7.25 6.8934 7.58579 6.55762 8 6.55762Z"
            fill="#27313F"
          />
        </g>
      </svg>
    );
};

Information.defaultProps = {
  className: ''
};

export default Information;
