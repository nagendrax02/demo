import { useEntityAttributeDetailsStore } from '../../store/entity-attribute-details-store';
import styles from './count.module.css';
interface ICount {
  value?: number;
}

const Count = ({ value }: ICount): JSX.Element => {
  const { count, searchValue, matchedCount } = useEntityAttributeDetailsStore();

  return (
    <div data-testid="ead-count" className={styles.count}>
      {searchValue?.length > 0
        ? `Search Results (${matchedCount})`
        : `All (${count ? count : value})`}
    </div>
  );
};
Count.defaultProps = {
  value: 0
};

export default Count;
