import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './submission-retrieval.module.css';
interface ITitle {
  value: string;
  isLoading: boolean;
}
const Title = ({ value, isLoading }: ITitle): JSX.Element => {
  return (
    <div className={styles.title} title={value}>
      {isLoading ? <Shimmer height="28px" width="250px" /> : value}
    </div>
  );
};

export default Title;
