import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './shimmer.module.css';
interface IShimmerProps {
  rowCount?: number;
  columnsCount?: number;
}
const TableShimmer = (props: IShimmerProps): JSX.Element => {
  const { rowCount, columnsCount } = props;
  return (
    <div>
      <div className={`${styles.shimmer_header}`}></div>
      {Array(rowCount ?? 25)
        .fill(0)
        .map(() => {
          return (
            <div className={`${styles.table_row_shimmer}`} key={Math.random()}>
              {Array(columnsCount ?? 5)
                .fill(0)
                .map(() => {
                  return (
                    <Shimmer className={`${styles.table_column_shimmer}`} key={Math.random()} />
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

export default TableShimmer;
