import { IRecordType } from '../../smartview-tab/smartview-tab.types';
import styles from './manage-list.module.css';

const ListMemberCount = ({ record }: { record: IRecordType }): JSX.Element => {
  return (
    <div className={styles.member_count_container}>
      {record?.MemberCount ? record?.MemberCount : '0'}
    </div>
  );
};

export default ListMemberCount;
