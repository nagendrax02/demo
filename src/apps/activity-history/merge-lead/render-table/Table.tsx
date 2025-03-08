import { IHeaderData, ISectionData } from '../merge-lead-types';
import TableHeader from './header/Header';
import Section from './section/Section';
import Shimmer from './shimmer/Shimmer';
import styles from './table.module.css';

export interface ITable {
  headerData: IHeaderData | null;
  sectionData: ISectionData[] | null;
  width?: string;
  isLoading?: boolean;
}

const Table = ({ headerData, sectionData, width, isLoading }: ITable): JSX.Element => {
  const getMaxNumColumn = (): number => {
    let maxColumns = 1;

    sectionData?.forEach?.((section) => {
      const maxColumnPossible = section?.rows?.[0]?.columns?.length;
      if (maxColumnPossible > maxColumns) {
        maxColumns = maxColumnPossible;
      }
    });
    return maxColumns;
  };

  return isLoading ? (
    <Shimmer columnsCount={3}></Shimmer>
  ) : (
    <table className={`${styles.table}`} width={width}>
      <TableHeader headerData={headerData}></TableHeader>
      {sectionData?.map?.((section) => {
        return (
          <Section
            sectionData={section}
            key={Math.random()}
            maxColumn={getMaxNumColumn()}></Section>
        );
      })}
    </table>
  );
};

export default Table;
