import { IIcon } from '../custom-icon.types';

const KeyboardDownArrow = (props: IIcon): React.ReactNode => {
  const { className, type } = props;

  if (type === 'outline') {
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.97982 6.31344C5.17508 6.11818 5.49167 6.11818 5.68693 6.31344L8.00004 8.62655L10.3132 6.31344C10.5084 6.11818 10.825 6.11818 11.0203 6.31344C11.2155 6.5087 11.2155 6.82528 11.0203 7.02055L8.35359 9.68721C8.15833 9.88247 7.84175 9.88247 7.64649 9.68721L4.97982 7.02055C4.78456 6.82528 4.78456 6.5087 4.97982 6.31344Z"
        />
      </svg>
    );
  }
};

export default KeyboardDownArrow;
