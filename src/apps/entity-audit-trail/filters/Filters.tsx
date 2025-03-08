import DateFilter from './date-filter';
import styles from './filters.module.css';
import TypeFilter from './type-filter';

const Filters = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <TypeFilter />
      <DateFilter />
    </div>
  );
};

export default Filters;
