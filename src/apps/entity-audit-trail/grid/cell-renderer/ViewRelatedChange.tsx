import { trackError } from 'common/utils/experience/utils/track-error';
import { useState } from 'react';
import styles from './cell-renderer.module.css';
import { IAuditTrailAugmentedData, IAuditTrailRawData } from '../../entity-audit-trail.types';
import useAuditTrailStore from '../../entity-audit-trail.store';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getAugmentedAuditTrailData } from '../../utils/augment-data';
import Spinner from '@lsq/nextgen-preact/spinner';
import { HIDE_RELATED_CHANGE, VIEW_RELATED_CHANGE } from '../constants';

const ViewRelatedChange = ({ record }: { record: IAuditTrailAugmentedData }): JSX.Element => {
  const { augmentedAuditTrailData, rawAuditTrailData, setAugmentedAuditTrailData, entityCoreData } =
    useAuditTrailStore();

  const entityId = entityCoreData?.entityIds?.[entityCoreData?.entityDetailsType];
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onViewRelatedChangesClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const body = {
        CorrelationId: record.id,
        EntityId: entityId,
        LeadID: entityId
      };
      const response: IAuditTrailRawData = await httpPost({
        path: API_ROUTES.LeadAuditLogGet,
        module: Module.Marvin,
        body: body,
        callerSource: CallerSource.EntityAuditTrail
      });
      const augmentedData = getAugmentedAuditTrailData(response, {
        showRecord: true,
        visibility: 'show'
      });
      const tempData = { ...augmentedAuditTrailData, ...augmentedData };
      setAugmentedAuditTrailData(tempData);
    } catch (err) {
      trackError(err);
    }
    setIsLoading(false);
  };

  const onHideRelatedChangesClick = (): void => {
    try {
      const augmentedData = getAugmentedAuditTrailData(rawAuditTrailData);
      setAugmentedAuditTrailData(augmentedData);
    } catch (err) {
      trackError(err);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.view_related_change_label}>
        <Spinner customStyleClass={styles.view_related_change_spinner} />
      </div>
    );
  }

  if (record?.relatedChangeRecordConfig?.visibility == 'show') {
    return (
      <button className={styles.view_related_change_label} onClick={onHideRelatedChangesClick}>
        {HIDE_RELATED_CHANGE}
      </button>
    );
  }

  return (
    <button className={styles.view_related_change_label} onClick={onViewRelatedChangesClick}>
      {VIEW_RELATED_CHANGE}
    </button>
  );
};

export default ViewRelatedChange;
