import { trackError } from 'common/utils/experience/utils/track-error';
import styles from './default-tasks-page.module.css';
import { TaskIcon } from '../tasks-icon';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { getConvertedAddTask, showTaskProcessForm } from '../../utils';
import { useEffect, useState, lazy } from 'react';
import { IProcessFormsData, IProcessMenuItem } from 'common/utils/process/process.types';
import ButtonText from './ButtonText';
import { ActionWrapper } from 'common/component-lib/action-wrapper';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { formSubmissionConfig } from '../../tasks.store';
import { CallerSource } from 'common/utils/rest-client';
import {
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { getEntityTaskAction } from './utils';
import { EntityType } from 'common/types/entity.types';
import { RecordType, useTabRecordCounter } from 'common/component-lib/tab-record-counter';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const DefaultTaskPage = ({
  tabId,
  entityRepName,
  coreData
}: {
  tabId: string;
  entityRepName: IEntityRepresentationName;
  coreData: IEntityDetailsCoreData;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);
  const { updateTabRecordCount } = useTabRecordCounter();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setIsLoading(true);
        const fetchData = (await import('common/utils/process/process'))
          .fetchMultipleWorkAreaProcessForms;
        const processForms = await fetchData(
          [getEntityTaskAction(tabId, coreData)?.workAreaConfig || { workAreaId: -1 }],
          CallerSource.Tasks
        );
        if (processForms) setProcessFormsData(processForms);
      } catch (error) {
        trackError(error);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertedAction = getConvertedAddTask({ processFormsData, tabId, isLoading, coreData });
  const hasProcessForms = convertedAction?.subMenu?.length;

  const getIcon = (): JSX.Element => {
    return hasProcessForms ? <Icon name={'expand_more'} customStyleClass={styles.icon} /> : <></>;
  };

  const getDefaultPageTitle = (): string => {
    return coreData.entityDetailsType === EntityType.Opportunity
      ? `Add Tasks to ${coreData.entityTypeRepName}`
      : `Add Tasks to manage your ${entityRepName?.SingularName || 'Lead'}`;
  };

  const handleClick = async (): Promise<void> => {
    if (convertedAction?.isLoading) return;
    const processActionClickHandler = await import(
      'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
    );
    const augmentedAction = {
      id: convertedAction.id || '',
      title: getDefaultPageTitle() || '',
      workAreaConfig: convertedAction.workAreaConfig
    };
    const formConfig = await processActionClickHandler.getFormConfig({
      action: augmentedAction,
      onSuccess: () => {
        formSubmissionConfig.isSuccessful = true;
      },
      onShowFormChange: (showForm: boolean) => {
        if (!showForm) {
          useFormRenderer.getState().setFormConfig(null);
          updateTabRecordCount(coreData?.entityIds?.lead, RecordType.Task);
          if (formSubmissionConfig.isSuccessful) {
            updateLeadAndLeadTabs();
            formSubmissionConfig.isSuccessful = false;
          }
        }
      },
      coreData,
      customConfig: {
        oppTypeName: coreData?.entityTypeRepName || ''
      }
    });
    useFormRenderer.getState().setFormConfig(formConfig);
  };

  const handleMenuItemSelect = async (data: IProcessMenuItem): Promise<void> => {
    await showTaskProcessForm({ data, coreData });
  };

  return (
    <div className={styles.default_center}>
      <TaskIcon customStyleClass={styles.default_page_icon} variant={IconVariant.TwoTone} />
      <section className={styles.default_section}>
        <div className={styles.default_title}>{getDefaultPageTitle()}</div>
        <ActionWrapper
          menuKey={`${convertedAction.id}`}
          action={convertedAction}
          id={convertedAction.id || ''}
          onMenuItemSelect={handleMenuItemSelect}>
          <Button
            customStyleClass={styles.add_task_button}
            text={<ButtonText action={convertedAction} />}
            onClick={handleClick}
            dataTestId="default-page-add-tasks"
            rightIcon={getIcon()}
            title={getDefaultPageTitle()}></Button>
        </ActionWrapper>
      </section>
    </div>
  );
};

export default DefaultTaskPage;
