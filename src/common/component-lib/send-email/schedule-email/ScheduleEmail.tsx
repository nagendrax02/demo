import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, useEffect, useState } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './schedule-email.module.css';
import { IEmailCols, IResponse, IScheduleEmail, ScheduleType } from './schdeule-email.types';
import { gridKey, scheduleEmailColDefs } from './constants';
import { Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { ITitleConfig } from 'apps/entity-details/types';
import { IGridConfig } from '@lsq/nextgen-preact/grid/grid.types';
import { filterRecord, formatDate, handleSort } from './utils';
import { getFormattedDateTime } from 'common/utils/date';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import Grid, { GridShimmer } from '@lsq/nextgen-preact/grid';
import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

const ScheduleEmail = (props: IScheduleEmail): JSX.Element => {
  const { handleClose, leadId, leadRepresentationName, leadName, callerSource, type } = props;
  const [emailRecords, setEmailRecords] = useState<IEmailCols[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(true);
  const { setNotification } = useNotificationStore();
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [cancelledId, setCancelledId] = useState<string>('');

  const augmentedData = useEntityDetailStore(
    (state) => state.augmentedEntityData?.vcard?.body?.primarySection?.components
  )?.filter((data) => data.type === 1);

  const handleCancelledId = (id: string): void => {
    setCancelledId(id);
  };

  useEffect(() => {
    const filteredRecords = filterRecord(emailRecords, cancelledId);
    setEmailRecords(filteredRecords);
  }, [cancelledId]);

  useEffect(() => {
    try {
      setIsLoading(true);
      (async function invokeApi(): Promise<void> {
        const body = {
          CampaignMemberId: leadId,
          Type: type ?? 4
        };
        const path = API_ROUTES.scheduleEmails;
        const response = (await httpPost({
          path,
          module: Module.Marvin,
          body,
          callerSource
        })) as IResponse[];
        if (response?.length) {
          const formattedResponse = response.map((res: IResponse) => {
            return {
              id: res.ID,
              subjectName: res.Subject,
              scheduledOn: `${formatDate(getFormattedDateTime({ date: res.ScheduledOn }))} ${
                res.ScheduledOnTimeZone
              }`,
              scheduledBy: res.CreatedByName,
              leadId: leadId,
              cancelledAction: handleCancelledId
            };
          });
          setEmailRecords(formattedResponse);
        }
        setIsLoading(false);
      })();
    } catch (error) {
      trackError(error);
      setShowModal(false);
      setIsLoading(false);
      setNotification({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    }
  }, []);

  const getTitle = (): string => {
    if (type === ScheduleType.LIST)
      return `${emailRecords?.length} Emails Scheduled for List ${leadName}`;
    return `${emailRecords?.length} Emails Scheduled for ${leadRepresentationName} ${leadName} ${
      (augmentedData?.[0]?.config as ITitleConfig)?.content || 'Lead'
    }`;
  };

  const onChange = (args: IGridConfig): void => {
    const order = args.sortConfig?.sortOrder as number;
    setSortOrder(order);
  };

  useEffect(() => {
    const sortedRecords = handleSort(emailRecords, sortOrder);
    setEmailRecords(sortedRecords);
  }, [sortOrder]);

  const getEmailGrid = (): JSX.Element => {
    return emailRecords?.length ? (
      <Suspense fallback={<GridShimmer rows={5} columns={4} />}>
        <div className={styles.content}>
          <Grid<IEmailCols>
            gridKey={gridKey}
            columnDefs={scheduleEmailColDefs}
            records={emailRecords || []}
            config={{
              sortConfig: {
                sortColumn: 'scheduledOn',
                sortOrder: sortOrder
              }
            }}
            onChange={onChange}
            showCustomStyle
            theme={getCurrentTheme()}
            gridClass={styles.grid_container}
          />
        </div>
      </Suspense>
    ) : (
      <div className={styles.icon_container}>
        <div>
          <Icon
            name="event_busy"
            customStyleClass={styles.icon_style}
            variant={IconVariant.TwoTone}
          />
        </div>
        <div className={styles.no_mail_text}>No Emails Scheduled</div>
      </div>
    );
  };

  return (
    <div>
      <Modal show={showModal} customStyleClass={styles.container}>
        <Modal.Header
          title={getTitle()}
          onClose={(): void => {
            handleClose();
          }}
        />
        <Modal.Body customStyleClass={styles.custom_body}>
          {isLoading ? <GridShimmer rows={5} columns={4} /> : getEmailGrid()}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ScheduleEmail;
