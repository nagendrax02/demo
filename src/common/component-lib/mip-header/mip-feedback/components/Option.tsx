import styles from '../feedback.module.css';
interface IOption {
  title: string;
  onClick: () => void;
  selected: boolean;
}

const Option = ({ title, onClick, selected }: IOption): JSX.Element => {
  return (
    <div onClick={onClick} className={`${styles.option} ${selected ? styles.selected : ''} `}>
      {title}
    </div>
  );
};

export default Option;
