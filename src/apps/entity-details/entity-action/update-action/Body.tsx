import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import styles from './Update.module.css';
import { IModalBody } from './update.types';
import { ACTION } from '../../constants';
import Checkbox from '@lsq/nextgen-preact/checkbox';
import { EntityType } from 'common/types';
import { fetchLeadMetaData } from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { fetchAccountMetaData } from 'common/utils/entity-data-manager/account/metadata';
import SelectedEntityCount from './SelectedEntityCount';

const Body = (props: IModalBody): JSX.Element => {
  const {
    required,
    showError,
    actionType,
    compRender,
    getBodyTitle,
    selectedSchema,
    sendCalenderInvite,
    directRenderComponent,
    entityDetailsCoreData,
    setSendCalenderInvite,
    leadRepresentationName,
    selectedEntityCount
  } = props;
  const {
    entityDetailsType,
    entityIds: { EntityTypeId = '' }
  } = entityDetailsCoreData;
  const [label, setLabel] = useState('');

  useEffect(() => {
    try {
      (async (): Promise<void> => {
        const { metaData = {} } =
          entityDetailsType === EntityType.Account
            ? await fetchAccountMetaData(EntityTypeId, CallerSource.AccountDetails)
            : await fetchLeadMetaData(CallerSource.SmartViews);
        const inputLabel =
          actionType === ACTION.ChangeOwner || actionType === ACTION.ChangeTaskOwner
            ? 'Owner'
            : `${leadRepresentationName?.SingularName || 'Lead'} Stage`;
        if (selectedSchema && metaData[selectedSchema]) {
          setLabel(
            actionType !== ACTION.ChangeTaskOwner
              ? metaData[selectedSchema]?.DisplayName ?? inputLabel
              : inputLabel
          );
        }
      })();
    } catch (err) {
      trackError(err);
    }
  }, [actionType, EntityTypeId, entityDetailsType, selectedSchema]);

  if (directRenderComponent) {
    return compRender[actionType];
  }

  const fieldTitle = (): string => {
    if (actionType === ACTION.ChangeTaskOwner) return 'Task';
    return leadRepresentationName?.SingularName ? leadRepresentationName?.SingularName : 'Lead';
  };

  return (
    <div>
      <SelectedEntityCount
        entityDetailsCoreData={entityDetailsCoreData}
        selectedEntityCount={selectedEntityCount}
        entityDetailsType={entityDetailsType}
      />

      <div title={getBodyTitle?.[actionType]} className={`${styles.title} ${styles.body_header}`}>
        {getBodyTitle?.[actionType]}
      </div>
      <section>
        <div className={styles.title}>{fieldTitle()} Field</div>
        <div className={styles.property_name}>{label}</div>
        <div className={styles.title}>
          Update To
          {required ? <span className={styles.restricted}>*</span> : null}
        </div>
        <div className={styles.dropdown}>{compRender[actionType]}</div>
        <div className={styles.error}>{showError ? 'Required Field' : null}</div>
        {actionType === ACTION.ChangeTaskOwner ? (
          <div className={styles.send_invitation_wrapper}>
            <Checkbox
              checked={sendCalenderInvite}
              changeSelection={() => {
                setSendCalenderInvite(!sendCalenderInvite);
              }}
            />
            <span className={styles.send_invitation_text}>Send Invitation Email</span>
          </div>
        ) : null}
      </section>
      <div></div>
    </div>
  );
};

export default Body;
