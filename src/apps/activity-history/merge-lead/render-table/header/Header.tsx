import { IHeaderData } from '../../merge-lead-types';
import styles from './header.module.css';
import commonStyles from '../common.module.css';
interface ITableHeaderProp {
  headerData: IHeaderData | null;
}

const TableHeader = ({ headerData }: ITableHeaderProp): JSX.Element | null => {
  return headerData ? (
    <thead>
      <tr className={`${styles.table_header_row}`}>
        {headerData?.row?.columns?.map?.((columnData) => {
          return (
            <td
              className={`${commonStyles.common_table_column} ${styles.table_header_column} ${columnData.className}`}
              key={Math.random()}>
              {columnData.dataToShow}{' '}
            </td>
          );
        })}
      </tr>
    </thead>
  ) : null;
};

export default TableHeader;
