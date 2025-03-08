/* eslint-disable complexity */
import {
  IAugmentedAHDetail,
  ActionIconType,
  IAdditionalDetails
} from 'apps/activity-history/types';
import { EntityType, Variant } from 'common/types';
import { ACTIVITY, OPPORTUNITY, activityType } from 'apps/activity-history/constants';
import Edit from './edit';
import View from './view';
import { isCancelledActivity } from '../utils';
import ReplyEmail from './reply-email';
import styles from './actions.module.css';
import {
  useSetSelectedDetails,
  useSetSelectedIdToPerformAction,
  useSetShowModal
} from 'apps/activity-history/activity-history.store';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { CallerSource } from 'common/utils/rest-client';
import { safeParseJson } from 'common/utils/helpers';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IActions {
  data: IAugmentedAHDetail;
  updateActivity?: (activityId: string, isDelete: boolean) => void;
  leadId?: string;
  opportunityId?: string;
  editAction?: boolean;
  deleteAction?: boolean;
  replyEmail?: boolean;
  isEmailActivity?: boolean;
  entityType?: EntityType;
  type?: EntityType;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

const Actions = (props: IActions): JSX.Element => {
  const {
    data,
    updateActivity,
    leadId,
    opportunityId,
    editAction,
    deleteAction,
    replyEmail,
    isEmailActivity,
    type,
    entityDetailsCoreData
  } = props;

  const isOpportunity = !!(entityDetailsCoreData?.entityIds?.opportunity || opportunityId);

  const setSelectedIdToPerformAction = useSetSelectedIdToPerformAction();

  // only for account details
  const activityTypeProperties = safeParseJson(data?.ActivityTypeProperties || '') as Record<
    string,
    string
  >;
  const canDeleteAccountActivity = activityTypeProperties?.CanDeleteActivity && data?.CanUpdate;

  const { AdditionalDetails, ActivityEvent, Id, IsEditable, CanUpdate, CanDeleteActivity } =
    data || {};

  const setShowModal = useSetShowModal();
  const setSelectedDetails = useSetSelectedDetails();

  const { ActivityEntityType, ActivityNote_Event: eventNote } = AdditionalDetails || {};

  const getViewIcon = (): JSX.Element | null => {
    if (ActivityEntityType === OPPORTUNITY || ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG) {
      return (
        <View
          additionalDetails={AdditionalDetails as IAdditionalDetails}
          isOpportunity
          activityEvent={ActivityEvent as number}
          activityId={Id as string}
        />
      );
    }
    return null;
  };

  const canShowEditIconForActivityType = (): boolean => {
    return !(isEmailActivity || data?.ActivityName === activityType.DataProtection);
  };

  const canShowIcon = (actionIconType: ActionIconType): boolean => {
    const isChangeLog =
      ActivityEvent === ACTIVITY.CHANGE_LOG || ActivityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG;
    const isEditIcon =
      actionIconType === ActionIconType.Edit &&
      (IsEditable === 1 || CanUpdate) &&
      canShowEditIconForActivityType();
    const isDeleteIcon = actionIconType === ActionIconType.Delete;
    const isSalesCancelled = eventNote ? isCancelledActivity(eventNote) : false;

    if (isChangeLog) {
      return false;
    }

    if (isEditIcon) {
      return true;
    }

    if (isDeleteIcon) {
      if (ActivityEvent === ACTIVITY.SALES) {
        return !isSalesCancelled;
      }
      if (CanDeleteActivity || canDeleteAccountActivity) return true;
    }

    return false;
  };

  const handleActionClicked = (id: string): void => {
    setSelectedIdToPerformAction(id);
    if (updateActivity) updateActivity(id, true);
  };

  const getIconName = ActivityEvent === ACTIVITY.SALES ? 'close' : 'delete';

  const getId = (): string => {
    if (type === EntityType.Account) return data?.CompanyActivityId || '';
    return Id || '';
  };

  const onClick = (): void => {
    if (ActivityEvent !== ACTIVITY.SALES) {
      setShowModal('delete', true, CallerSource.ActivityHistorySalesActivity);
      handleActionClicked(getId() || '');
    } else if (ActivityEvent === ACTIVITY.SALES) {
      setShowModal('cancel', true, CallerSource.ActivityHistorySalesActivity);
      handleActionClicked(Id || '');
    }
    setSelectedDetails(data);
  };

  return (
    <div className={styles.actions_wrapper}>
      {replyEmail ? <ReplyEmail data={data} /> : null}
      {!isOpportunity ? getViewIcon() : null}
      {editAction && canShowIcon(ActionIconType.Edit) ? (
        <Edit
          data={data}
          leadId={leadId as string}
          opportunityId={opportunityId as string}
          type={type}
          entityDetailsCoreData={entityDetailsCoreData}
        />
      ) : null}
      {deleteAction && canShowIcon(ActionIconType.Delete) ? (
        <Button
          text={
            <Icon name={getIconName} customStyleClass={styles.icon} variant={IconVariant.Filled} />
          }
          onClick={onClick}
          variant={Variant.Secondary}
          title={ActivityEvent === ACTIVITY.SALES ? 'Cancel' : 'Delete'}
          customStyleClass={styles.button}
          data-testid={`${
            ActivityEvent === ACTIVITY.SALES ? 'ah-cancel-action' : 'ah-delete-action'
          }`}
        />
      ) : null}
    </div>
  );
};

Actions.defaultProps = {
  viewAction: true,
  editAction: true,
  deleteAction: true,
  replyEmail: false,
  entityType: undefined,
  updateActivity: undefined,
  opportunityId: undefined,
  leadId: undefined,
  handleActionClicked: undefined
};

export default Actions;
