import { useEffect, useState } from 'react';
import { ExceptionMessage, IEntityExport } from './entity-export.types';
import TabSettings from 'apps/smart-views/components/smartview-tab/components/tab-settings';
import {
  getTabData,
  useTabEntityCode,
  useTabType
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import {
  getAdditionalEntityColumns,
  getFetchCriteria,
  getMaxExportConfig,
  getPermissionForExport,
  getExportRestrictionFromTenantSetting
} from './utils';
import Modal from '@lsq/nextgen-preact/modal';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './entity-export.module.css';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { getTaskTypeFilterValue } from 'common/utils/helpers/helpers';

const EntityExport = (props: IEntityExport): JSX.Element => {
  const { tabId, show, setShow, selectedAction } = props;

  const [showLoader, setShowLoader] = useState(true);

  const { setNotification } = useNotificationStore();

  const [maxEntityExport, setMaxEntityExport] = useState<string>('');
  const [minRecordForAsyncRequest, setMinRecordForAsyncRequest] = useState<number>();

  const tabData = getTabData(tabId);

  const listId = tabData?.gridConfig?.fetchCriteria?.ListId;

  const tabEntityCode = useTabEntityCode(tabId);

  const tabType = useTabType();

  const getCapitalizeTabType = (): string => {
    return tabType?.charAt(0)?.toUpperCase() + tabType.slice(1);
  };

  useEffect(() => {
    (async function getEntityConfig(): Promise<void> {
      setShowLoader(true);

      const [isExportRestricted, settingInfo] = await Promise.all([
        getPermissionForExport(tabData?.type),
        getExportRestrictionFromTenantSetting()
      ]);
      if (
        isExportRestricted ||
        settingInfo?.RestrictExportForAllEntities ||
        settingInfo?.RestrictEntityExport?.includes(getCapitalizeTabType())
      ) {
        setNotification({
          type: Type.ERROR,
          message: ERROR_MSG.actonPermission
        });
        setShow(false);
        return;
      }

      const config = await getMaxExportConfig({
        tabType: tabData?.type,
        entityCode: getTaskTypeFilterValue(tabData) || tabData?.entityCode,
        setMinRecordForAsyncRequest: setMinRecordForAsyncRequest,
        tabEntityCode: tabEntityCode ?? '',
        tabId
      });
      if (config === ExceptionMessage.MXUnauthorizedRequestException) {
        setNotification({
          type: Type.ERROR,
          message: config
        });
        setShow(false);
      } else {
        setMaxEntityExport(config);
        setShowLoader(false);
      }
    })();
  }, []);

  return (
    <>
      {showLoader ? (
        <Modal show={showLoader} customStyleClass={styles.modal_container}>
          <Modal.Header
            onClose={() => {
              setShow(false);
            }}
            title={`Export ${tabData?.representationName?.SingularName}`}
          />
          <Modal.Body>
            <Spinner customStyleClass={styles.custom_spinner} />
          </Modal.Body>
        </Modal>
      ) : (
        <TabSettings
          selectedAction={selectedAction}
          tabId={tabId}
          show={show}
          setShow={setShow}
          entityExportConfig={{
            maxExportAllowed: parseInt(maxEntityExport || '0'),
            fetchCriteria: getFetchCriteria(tabData, tabData?.type, listId || ''),
            minRecordForAsyncRequest: minRecordForAsyncRequest,
            additionalEntityColumns: getAdditionalEntityColumns(tabData?.type),
            restrictionMessage: 'Permission restricted'
          }}
        />
      )}
    </>
  );
};

export default EntityExport;
