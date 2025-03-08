import styles from './lead_star.module.css';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import Spinner from '@lsq/nextgen-preact/spinner';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { useEffect, useState } from 'react';
import { IRecordType } from '../smartview-tab/smartview-tab.types';
import { classNames } from 'common/utils/helpers/helpers';
import { Star } from 'assets/custom-icon/v2';

export interface ILeadStar {
  record: IRecordType;
  leadId: string;
  leadTypeInternalName?: string;
}

enum ResponseStatus {
  Success = 'Success',
  Error = 'Error'
}

const ErrorMessage = 'There was an error processing the request. Please contact administrator.';

const LeadStar = ({ record, leadId, leadTypeInternalName }: ILeadStar): JSX.Element => {
  const { showAlert } = useNotification();

  const [starredLeads, setStarredLeads] = useState({
    isStarred: record?.IsStarredLead?.toLowerCase() === 'true',
    isUpdating: false
  });

  useEffect(() => {
    setStarredLeads({
      isStarred: record?.IsStarredLead?.toLowerCase() === 'true',
      isUpdating: false
    });
  }, [record]);

  const handleUnStarALead = async (): Promise<void> => {
    try {
      setStarredLeads({ isStarred: true, isUpdating: true });

      let path = `${API_ROUTES.LeadUnStar}?leadId=${leadId}`;
      if (leadTypeInternalName) {
        path = `${path}&leadType=${leadTypeInternalName}`;
      }

      const response: { Status: ResponseStatus } = await httpGet({
        path: path,
        module: Module.LeadManagement,
        callerSource: CallerSource.SmartViews
      });

      if (response.Status === ResponseStatus.Success) {
        setStarredLeads({ isStarred: false, isUpdating: false });
      }

      if (response.Status === ResponseStatus.Error) {
        setStarredLeads({ isStarred: true, isUpdating: false });
        showAlert({ type: Type.ERROR, message: ErrorMessage });
      }
    } catch (error) {
      setStarredLeads({ isStarred: true, isUpdating: false });
      showAlert({ type: Type.ERROR, message: ErrorMessage });
    }
  };

  const handleStarALead = async (): Promise<void> => {
    try {
      setStarredLeads({ isStarred: false, isUpdating: true });

      let path = `${API_ROUTES.LeadStar}?leadId=${leadId}`;
      if (leadTypeInternalName) {
        path = `${path}&leadType=${leadTypeInternalName}`;
      }

      const response: { Status: ResponseStatus } = await httpGet({
        path: path,
        module: Module.Marvin,
        callerSource: CallerSource.SmartViews
      });
      if (response.Status === ResponseStatus.Success) {
        setStarredLeads({ isStarred: true, isUpdating: false });
      }

      if (response.Status === ResponseStatus.Error) {
        setStarredLeads({ isStarred: false, isUpdating: false });
        showAlert({ type: Type.ERROR, message: ErrorMessage });
      }
    } catch (error) {
      setStarredLeads({ isStarred: false, isUpdating: false });
      showAlert({ type: Type.ERROR, message: ErrorMessage });
    }
  };

  if (starredLeads?.isUpdating) {
    return (
      <div className={styles.container}>
        <Spinner customStyleClass={styles.custom_spinner_style} />
      </div>
    );
  }

  return (
    <div>
      {!starredLeads?.isStarred ? (
        <button className={styles.button} onClick={handleStarALead}>
          <Star className={classNames(styles.lead_start, styles.lead_empty_star)} type="outline" />
        </button>
      ) : (
        <button className={styles.button} onClick={handleUnStarALead}>
          <Star className={classNames(styles.lead_start, styles.lead_filled_star)} type="filled" />
        </button>
      )}
    </div>
  );
};

export default LeadStar;
