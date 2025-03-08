import { IConnectorConfig } from 'common/types/entity/lead';
import { useMailMerge } from './use-mailmerge';
import { useEffect, useState } from 'react';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { connectorActions } from './constants';
import { callAnAPI } from './utils';
import Popup from './Popup';
import { CallerSource } from 'common/utils/rest-client';
import { EntityType } from 'common/types';
import { IConfig } from './cutom-actions.types';
import { addActivityConfig, addLeadConfig, addOpportunityConfig, addTaskConfig } from './config';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

export interface ICustomActions {
  entityRecords?: Record<string, unknown>[];
  connectorConfig: IConnectorConfig;
  toggleShow: () => void;
  callerSource: CallerSource;
  entityType?: EntityType;
  coreData?: IEntityDetailsCoreData;
}

const CustomActions = ({
  entityRecords,
  toggleShow,
  callerSource,
  connectorConfig,
  entityType,
  coreData
}: ICustomActions): JSX.Element => {
  const { Config } = connectorConfig;
  const { showAlert } = useNotification();

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const getMailMergeConfig = (): IConfig => {
    let mailMergeConfig: IConfig = {
      actionConfig: Config.ActionConfig
    };

    if (!entityRecords?.length) {
      return mailMergeConfig;
    }

    switch (entityType) {
      case EntityType.Activity:
        mailMergeConfig = addActivityConfig(mailMergeConfig, entityRecords);
        break;
      case EntityType.Opportunity:
        mailMergeConfig = addOpportunityConfig(mailMergeConfig, entityRecords, coreData);
        break;
      case EntityType.Task:
        mailMergeConfig = addTaskConfig(mailMergeConfig, entityRecords);
        break;
      default:
        mailMergeConfig = addLeadConfig(mailMergeConfig, entityRecords);
        break;
    }

    return mailMergeConfig;
  };

  const { loading, mailMergeContent } = useMailMerge({
    config: getMailMergeConfig(),
    callerSource
  });
  const { configData = '', configURL = '' } = mailMergeContent;

  const closePopup = (): void => {
    setShowPopup(false);
    toggleShow();
  };

  const actions = {
    [connectorActions.OPEN_NEW_WINDOW]: (): void => {
      window.open(configURL, '_blank');
      toggleShow();
    },
    [connectorActions.CALL_API]: async (): Promise<void> => {
      await callAnAPI({
        actionConfig: Config.ActionConfig,
        configURL,
        showAlert,
        configData,
        callerSource
      });
      toggleShow();
    },
    [connectorActions.SHOW_POPUP]: async (): Promise<void> => {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (!loading && configURL && Config.Action) {
      actions[Config.Action]?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, configURL]);

  return (
    <>
      {showPopup ? (
        <Popup
          config={Config}
          onClose={closePopup}
          mailMergeData={mailMergeContent}
          callerSource={callerSource}
        />
      ) : null}
    </>
  );
};

CustomActions.defaultProps = {
  entityType: EntityType.Lead,
  entityRecords: undefined,
  coreData: undefined
};

export default CustomActions;
