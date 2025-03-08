import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../cell-renderer.module.css';
import ActivityDetailsModal from 'common/component-lib/modal/activity-details-modal';
import { CallerSource } from 'common/utils/rest-client';

export interface IProspectActivityCell {
  record: Record<string, string | null>;
  children: JSX.Element;
}

const ProspectActivityCell = ({ record, children }: IProspectActivityCell): JSX.Element => {
  const [showActivityModal, setShowActivityModal] = useState(false);

  const handModalShow = (): void => {
    setShowActivityModal(!showActivityModal);
  };

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    handModalShow();
    event.stopPropagation();
  };

  const getActivityId = (properties: Record<string, string | null>): string => {
    return properties?.ProspectActivityId_Max || properties?.P_ProspectActivityId_Max || '';
  };

  return (
    <>
      <div className={styles.activity_cell} onClick={handleOnClick}>
        {children}
      </div>
      {showActivityModal
        ? createPortal(
            <ActivityDetailsModal
              headerTitle="Activity Details"
              activityId={getActivityId(record)}
              callerSource={CallerSource.SmartViews}
              close={handModalShow}
            />,
            document.body
          )
        : null}
    </>
  );
};

export default ProspectActivityCell;
