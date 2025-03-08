import { getEnvConfig } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import Iframe from 'common/component-lib/iframe';
import { useEffect, useRef, useState } from 'react';
import useMarvinComponent from 'common/utils/marvin-helper';
import { EXTERNAL_FEATURE, ExternalComponentRoute } from '../constants';
import styles from './calendar-view.module.css';
import {
  generateInitCalendarViewPayload,
  generateSendMessage,
  handleSetOwnerFilter,
  handleSetRecordCount,
  getBooleanValue,
  handleOpenEntityDetails
} from './utils';
import { ITabConfig } from '../../smartview-tab/smartview-tab.types';
import useSmartViewStore, { updateSmartViewsTab } from 'apps/smart-views/smartviews-store';
import {
  getTabData,
  setCalendarView,
  setIsGridInitialized,
  setIsGridUpdated,
  useRefreshConfig
} from '../../smartview-tab/smartview-tab.store';
import { IReceivedMessage } from './calendar-view.types';
import { EventMessage } from 'common/utils/marvin-helper/constants';
import CalenderPopup from './CalendarPopup';
import { refreshGrid } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { ACTION } from 'apps/entity-details/constants';
import { CALENDAR_VIEW_MAP_CACHE } from 'apps/smart-views/augment-tab-data/task/constants';
import {
  endAllSvExperience,
  endSVExpEvent,
  isManageTab,
  startSVExpEvent
} from 'apps/smart-views/utils/utils';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

export interface ICalendarView {
  tabData: ITabConfig;
}
// eslint-disable-next-line max-lines-per-function
const CalendarView = (props: ICalendarView): JSX.Element => {
  startSVExpEvent(SmartViewsEvents.CalendarRender, props?.tabData?.id);

  const { tabData } = props;
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [task, setTask] = useState<Record<string, unknown> | undefined>();
  const smartviewId = useSmartViewStore((state) => state?.smartViewId);
  const { timeStamp } = useRefreshConfig() || {};

  const onSuccess = (): void => {
    setShowPopup(false);
    refreshGrid(tabData.id);
  };

  const handleDefaultForm = async (config: Record<string, string>): Promise<void> => {
    const { Name, Id, EntityType } = config;
    const processActionClickHandler = await import(
      'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
    );
    const formConfig = await processActionClickHandler.getFormConfig({
      action: {
        id: Id as string,
        title: Name as string,
        entityTypeId: EntityType as string
      },
      customConfig: config,
      onSuccess: onSuccess,
      onShowFormChange: (showForm: boolean) => {
        if (!showForm) {
          useFormRenderer.getState().setFormConfig(null);
        }
      }
    });
    useFormRenderer.getState().setFormConfig(formConfig);
  };

  const handleProcessForm = async (config: Record<string, string>): Promise<void> => {
    if (config.isDefaultForm) {
      return handleDefaultForm(config);
    }
    useFormRenderer.getState().setFormConfig({
      Config: config,
      OnSuccess: onSuccess,
      OnShowFormChange: (showForm) => {
        if (!showForm) {
          useFormRenderer.getState().setFormConfig(null);
        }
      }
    });
  };

  // eslint-disable-next-line complexity
  const handleReceivedMessage = async (data: IReceivedMessage): Promise<void> => {
    switch (data?.type) {
      case EventMessage.Type.CalendarRefresh: {
        const message = data?.message as boolean;
        setIsGridUpdated(message);
        setShowPopup(false);
        updateSmartViewsTab(tabData?.id, getTabData(tabData?.id));
        break;
      }
      case EventMessage.Type.CalenderEvent: {
        const record = data?.message as Record<string, unknown>;
        const {
          UserTaskId,
          DueDate,
          Status,
          CanUpdate,
          HasMarkCompletePermission,
          HasUpdatePermission,
          HasDeletePermission,
          IsRecurring,
          ['P_FirstName']: FirstName,
          ['P_LastName']: LastName
        } = record || {};
        setTask({
          ...record,
          id: UserTaskId,
          DueDate: (DueDate as string).replace('T', ' '),
          StatusCode: Status,
          CanUpdate: getBooleanValue(CanUpdate as string),
          HasMarkCompletePermission: getBooleanValue(HasMarkCompletePermission as string),
          HasUpdatePermission: getBooleanValue(HasUpdatePermission as string),
          HasDeletePermission: getBooleanValue(HasDeletePermission as string),
          IsRecurring: getBooleanValue(IsRecurring as string),
          FirstName: FirstName || '',
          LastName: LastName || ''
        });
        setShowPopup(true);
        break;
      }
      case EventMessage.Type.CalenderEventEdit: {
        const config = data?.message as Record<string, unknown>;
        handleProcessForm({
          ...config,
          Id: ACTION.EditTask
        });
        break;
      }
      case EventMessage.Type.CalenderEventCreate: {
        const config = data?.message as Record<string, unknown>;
        handleProcessForm({
          ...config,
          Id: ACTION.CreateTask
        });
        break;
      }
      case EventMessage.Type.SetCalendarView: {
        const calendarView = data?.message as string;
        setCalendarView(tabData?.id, CALENDAR_VIEW_MAP_CACHE[calendarView]);
        break;
      }
      case EventMessage.Type.SetOwnerFilter: {
        handleSetOwnerFilter(tabData, data);
        break;
      }
      case EventMessage.Type.SetRecordCount: {
        handleSetRecordCount(tabData, data);
        endSVExpEvent(SmartViewsEvents.CalendarRender, tabData?.id);
        endAllSvExperience(tabData);
        break;
      }
      case EventMessage.Type.OpenEntityDetails: {
        handleOpenEntityDetails(data);
        break;
      }
    }
  };

  const closePopup = (): void => {
    setShowPopup(false);
  };

  const { sendMessage } = useMarvinComponent({
    iframeRef: ref,
    initDataToSend: {
      route: ExternalComponentRoute.CalendarView,
      payload: generateInitCalendarViewPayload({ tabData, smartviewId })
    },
    onMessageReceive: handleReceivedMessage,
    feature: EXTERNAL_FEATURE.calendar
  });

  useEffect(() => {
    if (!isIFrameLoading) {
      setIsGridUpdated(false);
      sendMessage(generateSendMessage(tabData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData?.gridConfig?.fetchCriteria, tabData?.calendarView, timeStamp]);

  const handleOnLoad = (): void => {
    setIsGridInitialized(true);
  };

  const getLeadTypeQueryParam = (): string => {
    if (!isManageTab(tabData?.id)) return '';

    const leadType = tabData?.leadTypeConfiguration?.[0]?.LeadTypeInternalName ?? '';
    if (leadType?.length) return `&leadType=${leadType}`;
    return '';
  };

  return (
    <>
      <div className={styles.calendar_view_container}>
        <Iframe
          src={`${getEnvConfig(ENV_CONFIG.smartviewsRenderURL) as string}/?isSWLite=true&feature=${
            EXTERNAL_FEATURE.calendar
          }${getLeadTypeQueryParam()}`}
          width={'100%'}
          height={'100%'}
          onLoad={handleOnLoad}
          id="iframe-calendar-view"
          setShowSpinner={setIsIFrameLoading}
          showSpinner={isIFrameLoading}
          customRef={ref}
          customStyleClass={styles.iframe}
        />
      </div>
      {showPopup && task ? (
        <CalenderPopup gridConfig={tabData.gridConfig} task={task} closePopup={closePopup} />
      ) : null}
    </>
  );
};

export default CalendarView;
