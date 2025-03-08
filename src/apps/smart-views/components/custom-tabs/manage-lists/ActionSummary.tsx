import ConfirmationModal from '@lsq/nextgen-preact/modal/confirmation-modal';
import { MODAL_MESSAGES } from 'common/component-lib/entity-actions/list-action/constant';
import styles from './manage-list.module.css';
import { Variant } from '@lsq/nextgen-preact/button/button.types';
import Icon from '@lsq/nextgen-preact/icon';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { classNames } from 'common/utils/helpers/helpers';
import useManageListStore, { setActionSummary } from './manage-lists.store';
import { updateGridDataAfterPause } from 'apps/smart-views/utils/utils';

const ActionSummary = (): JSX.Element => {
  const actionSummary = useManageListStore((state) => state?.actionSummary);

  const getInfo = (isFailure?: boolean): JSX.Element => {
    return (
      <div
        className={classNames(
          styles.info_container,
          isFailure ? styles.failure_icon : styles.success_icon
        )}>
        <Icon
          name={isFailure ? 'warning' : 'check_circle'}
          variant={IconVariant.Filled}
          customStyleClass={styles.icon}
        />
        <span className={styles.count}>
          {isFailure ? actionSummary?.failureCount : actionSummary?.successCount}
        </span>
        {actionSummary?.successCount > 1 ? 'lists ' : 'list '}
        {isFailure
          ? MODAL_MESSAGES[actionSummary?.actionType]?.failureMessage
          : MODAL_MESSAGES[actionSummary?.actionType]?.successMessage}
      </div>
    );
  };

  const getFailureList = (): JSX.Element => {
    return (
      <Accordion
        name={actionSummary?.failureList?.length > 1 ? 'View Lists' : 'View List'}
        defaultState={DefaultState.CLOSE}
        arrowRotate={{
          angle: ArrowRotateAngle.Deg180,
          direction: ArrowRotateDirection.ClockWise
        }}
        customHeaderStyle={styles.accordion_header}>
        <div>
          {actionSummary?.failureList?.map((item, index) => (
            <div
              key={item}
              className={classNames(
                styles.name_container,
                styles.failure_list,
                index === 0 ? styles.failure_list_first_item : '',
                index === actionSummary?.failureList?.length - 1
                  ? styles.failure_list_last_item
                  : ''
              )}>
              <div className={classNames(styles.marker, styles.failure_marker)}></div>
              <div className={styles.identifier}>{item}</div>
            </div>
          ))}
        </div>
      </Accordion>
    );
  };

  const info = (): JSX.Element => {
    return (
      <div>
        {getInfo()}
        {getInfo(true)}
        <div className={styles.failure_description}>
          {MODAL_MESSAGES[actionSummary?.actionType]?.failureDescription}
        </div>
        {getFailureList()}
      </div>
    );
  };

  const close = (): void => {
    setActionSummary({
      isFailure: false,
      successCount: 0,
      failureCount: 0,
      failureList: [],
      actionType: ''
    });
    updateGridDataAfterPause();
  };

  return (
    <ConfirmationModal
      onClose={() => {
        close();
      }}
      show
      title={MODAL_MESSAGES[actionSummary?.actionType]?.title}
      description={info()}
      customStyleClass={classNames(styles.model_container, 'ng_h_4_b')}
      buttonConfig={[
        {
          id: 1,
          name: 'Close',
          variant: Variant.Secondary,
          onClick: close
        }
      ]}
    />
  );
};

export default ActionSummary;
