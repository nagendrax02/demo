import { ICalendarPopup } from './calendar-view.types';
import styles from './calendar-view.module.css';
import { IRecordType } from '../../smartview-tab/smartview-tab.types';

const CalendarPopup = ({ gridConfig, task, closePopup }: ICalendarPopup): JSX.Element => {
  const { columns } = gridConfig;

  const actionsColumn = columns?.find((col) => col.id === 'Actions');

  const filteredColumns = columns?.filter((col) => col.id !== 'Actions');

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    if (e.target === e.currentTarget) closePopup();
  };

  return (
    <>
      <div className={styles.calendar_popup_container} onClick={handleClick}>
        <div className={styles.calendar_popup}>
          <tr>
            <div className={styles.calendar_popup_content_container}>
              <div className={styles.calendar_popup_content}>
                {filteredColumns?.map((column) => {
                  return (
                    <div className={styles.calendar_popup_column} key={column.id}>
                      <td title={column.displayName} className={styles.calendar_popup_column_label}>
                        {column.displayName}
                      </td>
                      <td className={styles.calendar_popup_column_value}>
                        {column?.CellRenderer?.({
                          record: task as unknown as IRecordType,
                          columnDef: column
                        })}
                      </td>
                    </div>
                  );
                })}
              </div>
              <div className={styles.calendar_popup_actions}>
                {actionsColumn?.CellRenderer
                  ? actionsColumn?.CellRenderer({
                      record: task as unknown as IRecordType,
                      columnDef: actionsColumn
                    })
                  : null}
              </div>
            </div>
          </tr>
        </div>
      </div>
    </>
  );
};

export default CalendarPopup;
