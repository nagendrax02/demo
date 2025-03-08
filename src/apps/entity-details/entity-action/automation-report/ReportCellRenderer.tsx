import styles from './automation.module.css';
import { IReportCols } from './automation.types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import TreeArrowDownIcon from 'assets/custom-icon/TreeArrowDown';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IReportCellRenderer {
  record: IReportCols;
}

const ReportCellRenderer = (props: IReportCellRenderer): JSX.Element => {
  const { record } = props;
  const reportNameClass =
    record.level === 0 ? styles.report_name_level_0 : styles.report_name_level_non_0;

  return (
    <div
      className={styles.indented_report_container}
      style={{ paddingLeft: `${record.level * 22}px` }}>
      {record.level > 0 ? <TreeArrowDownIcon /> : null}
      <Tooltip
        placement={Placement.Vertical}
        content={record.reportName}
        trigger={[Trigger.Hover]}
        wrapperClass={styles.report_name}>
        <div className={`${styles.report_name} ${reportNameClass}`}>{record.reportName}</div>
      </Tooltip>
    </div>
  );
};

export default ReportCellRenderer;
