import { useEffect, useState } from 'react';
import { ICcBccOption } from '../../subject.type';
import styles from './email-header.module.css';

type CcBccData = (ICcBccOption | undefined)[] | undefined;
interface ICcBccFields {
  data: CcBccData;
  label: string;
}

const CcBccFields = ({ data, label }: ICcBccFields): JSX.Element | null => {
  const [newData, setNewData] = useState<CcBccData>([]);
  const [showViewLess, setShowViewLess] = useState(false);
  const viewLimit = 3;

  useEffect(() => {
    if (data && data?.length > viewLimit) {
      setNewData([...data.slice(0, viewLimit)]);
    } else {
      setNewData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data?.length) {
    return null;
  }

  const viewMore = (): void => {
    setNewData(data);
    setShowViewLess(true);
  };

  const viewLess = (): void => {
    if (data && data?.length > viewLimit) {
      setNewData([...data.slice(0, viewLimit)]);
    }
    setShowViewLess(false);
  };

  const showViewMore = data && data?.length > viewLimit && data.length !== newData?.length;

  return (
    <div className={styles.cc_bcc_fields}>
      <span className={styles.subtitle}>{label} - </span>
      {newData?.map((item, index) => {
        return (
          <span key={item?.Email}>
            <span className={styles.title}>{item?.Name}</span>
            <span className={styles.subtitle}>({item?.Email})</span>
            <span>{newData?.length > 1 && newData.length - 1 != index ? ', ' : ''}</span>
          </span>
        );
      })}
      {showViewMore ? (
        <span className={styles.view} onClick={viewMore}>
          View More
        </span>
      ) : null}
      {showViewLess && !showViewMore ? (
        <span className={styles.view} onClick={viewLess}>
          View Less
        </span>
      ) : null}
    </div>
  );
};

export default CcBccFields;
