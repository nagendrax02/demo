import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { getEntityId, safeParseJson } from 'common/utils/helpers';
import IFrame from 'common/component-lib/iframe/IFrame';
import { ITabsConfig } from '../entity-details/types';
import styles from './connector-tab.module.css';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import { getAccountTypeId, getOpportunityId } from 'common/utils/helpers/helpers';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

export interface IConnectorTab {
  tab: ITabsConfig;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}
const ConnectorTab = ({ tab, entityDetailsCoreData }: IConnectorTab): JSX.Element => {
  const { id, url } = tab;
  const [mailMergedUrl, setMailMergedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showIframeSpinner, setShowIframeSpinner] = useState(true);
  const { showAlert } = useNotification();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const content: string = await httpPost({
          path: API_ROUTES.mailMergedContent,
          module: Module.Connector,
          body: {
            data: url,
            leadId: (getEntityId() || entityDetailsCoreData?.entityIds?.lead) ?? '',
            companyId: getAccountTypeId(),
            opportunityId: getOpportunityId()
          },
          callerSource: CallerSource.EntityConnectorTab
        });
        setMailMergedUrl(safeParseJson(content) || content);
      } catch (error) {
        showAlert({
          type: Type.ERROR,
          message: (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE
        });
        trackError(error);
      } finally {
        setIsLoading(false);
        setShowIframeSpinner(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container} data-testid="entity-connector-tab">
      <IFrame
        id={id}
        showSpinner={isLoading || showIframeSpinner}
        setShowSpinner={setShowIframeSpinner}
        src={mailMergedUrl}
        attributes={{ loading: 'eager' }}
      />
    </div>
  );
};

ConnectorTab.defaultProps = {
  entityDetailsCoreData: {}
};

export default ConnectorTab;
