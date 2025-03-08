import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../../notes.module.css';
import { lazy, useState } from 'react';
import { IEntityIds } from '../../../entity-details/types/entity-store.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import Button from '@lsq/nextgen-preact/button';

const AddNotes = withSuspense(lazy(() => import('../add-notes')));

const DefaultNotesPage = (props: {
  entityIds: IEntityIds;
  entityRepName: IEntityRepresentationName;
}): JSX.Element => {
  const { entityIds, entityRepName } = props;
  const [showModal, setShowModal] = useState(false);

  const handleClick = (): void => {
    setShowModal(true);
  };

  return (
    <div className={styles.default_center}>
      <Icon
        name={'sticky_note_2'}
        variant={IconVariant.TwoTone}
        customStyleClass={styles.default_page_icon}
      />
      <section className={styles.default_section}>
        <div className={styles.default_title}>{`Add notes to your ${
          entityRepName?.SingularName || 'Lead'
        }`}</div>
        <Button text="+ Add Notes" onClick={handleClick} dataTestId="default-page-add-notes" />
      </section>
      {showModal ? (
        <AddNotes showModal={showModal} setShowModal={setShowModal} entityIds={entityIds} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default DefaultNotesPage;
