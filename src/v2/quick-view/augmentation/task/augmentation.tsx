import { IQuickViewCard } from '@lsq/nextgen-preact/quick-view/quick-view.types';
import fetchTaskMetaData from 'common/utils/entity-data-manager/task';
import { getOpportunityRepresentationName } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';
import { IGetAugmentedData, IQuickViewActionConfig } from '../augmentation.types';
import { fetchTaskDetails, fetchTaskProperties, getGradientColorSchema } from './helpers';
import { fetchRepresentationName as fetchLeadRepresentationName } from 'common/utils/entity-data-manager/lead/metadata';
import TaskSubjectIcon from './TaskSubjectIcon';
import { ITaskAdditionalData } from './task.types';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { TabType } from '../constant';
import EntityProperties from '../components/entity-properties/EntityProperties';
import TaskActions from './TaskActions';
import Close from '../components/quick-view-actions/Close';
import { setQuickViewContent } from 'src/store/quick-view/quick-view-store';
import AssociatedEntity from 'apps/smart-views/components/cell-renderers/associated-entity';
import TaskStatusBadge from './TaskStatusBadge';
import styles from './task.module.css';

const getQuickViewCardConfig = (
  entityRecord: ITaskAdditionalData,
  properties: IEntityProperty[],
  actionsConfig?: IQuickViewActionConfig
): IQuickViewCard => {
  return {
    vcardConfig: {
      Body: {
        components: [
          {
            type: 0,
            data: { content: entityRecord?.Name ? String(entityRecord?.Name) : 'Task' }
          },
          {
            type: 3,
            data: (
              <AssociatedEntity
                record={entityRecord}
                customStyle={styles.associated_entity}
                disableFullScreen
                badgeSize="md"
              />
            )
          }
        ]
      },
      Footer: actionsConfig ? (
        <TaskActions actionConfig={actionsConfig} entityRecord={entityRecord} />
      ) : null,
      Icon: {
        subIcon: <></>,
        icon: entityRecord ? <TaskSubjectIcon entityRecord={entityRecord} /> : <></>
      },
      quickActions: <TaskStatusBadge entityRecord={entityRecord} />
    },
    showPlaceHolder: false,
    tabs: [
      {
        id: TabType.Properties,
        title: 'Properties',
        content: <EntityProperties properties={properties} title="Task Properties" />
      }
    ],
    quickViewActions: [
      <Close
        key={entityRecord?.id}
        onClick={(): void => {
          setQuickViewContent(null);
        }}
      />
    ],
    colorSchema: getGradientColorSchema(entityRecord?.Color)
  };
};
export const getTaskAugmentedData = async (data: IGetAugmentedData): Promise<IQuickViewCard> => {
  const { entityId, entityRecord, entityTypeCode, actionsConfig } = data;
  if (!entityTypeCode || !entityId) {
    throw new Error('no valid task id and task type id found');
  }

  const [taskDetails, taskMetaData, leadName, oppName] = await Promise.all([
    fetchTaskDetails(entityId),
    fetchTaskMetaData(entityTypeCode, CallerSource.QuickView),
    fetchLeadRepresentationName(CallerSource.QuickView),
    getOpportunityRepresentationName(CallerSource.QuickView)
  ]);

  let taskProperties: IEntityProperty[] = [];
  if (entityRecord && taskDetails && taskMetaData) {
    taskProperties = fetchTaskProperties({
      entityRecord: entityRecord as ITaskAdditionalData,
      taskDetails,
      taskMetaData,
      leadSingularName: leadName?.SingularName,
      oppSingularName: oppName?.OpportunityRepresentationSingularName
    });
  }

  return getQuickViewCardConfig(entityRecord as ITaskAdditionalData, taskProperties, actionsConfig);
};
