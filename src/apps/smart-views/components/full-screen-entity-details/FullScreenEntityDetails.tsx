import { useEffect, useState } from 'react';
import EntityDetails from 'apps/entity-details';
import style from './full-screen-entity-details.module.css';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import FullScreenHeader, { useFullScreenDetails } from 'common/component-lib/full-screen-header';
import { generateMapForTabsToUpdate } from 'apps/forms/utils';

const FullScreenEntityDetails = (): JSX.Element => {
  const [animate, setAnimate] = useState(false);

  const { type, selectedRecordId, deletedRecordId } = useFullScreenDetails();

  const { setCoreData, coreData } = useEntityDetailStore();

  useEffect(() => {
    setAnimate(true);

    setCoreData({
      ...coreData,
      entityIds: {
        ...coreData.entityIds,
        [type]: selectedRecordId
      }
    });
    generateMapForTabsToUpdate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${style.container} ${animate ? style.animate : ''} ${
        deletedRecordId?.includes(selectedRecordId) ? style.delete_header_style : ''
      }`}>
      <FullScreenHeader />
      <EntityDetails
        type={type}
        key={selectedRecordId}
        isFullScreenMode
        customStyle={deletedRecordId?.includes(selectedRecordId) ? style.delete_body_style : ''}
      />
    </div>
  );
};

export default FullScreenEntityDetails;
