import Icon from '@lsq/nextgen-preact/icon';
import styles from './assign-leads.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import { IAssignedLeadsCols } from './assign-leads.types';
import useAssignLeadsStore, {
  useLeadRecords,
  useRemovedLeadsArray,
  useSelectedLeadsArray,
  useSetLeadRecords,
  useSetRemovedLeadsArray,
  useSetSelectedLeadsArray
} from './assignleads.store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface ICancelAction {
  record: IAssignedLeadsCols;
}

const CancelAction = (props: ICancelAction): JSX.Element => {
  const { record } = props;

  const { setDisabledSave, setShowLeadGrid } = useAssignLeadsStore();

  const setLeadRecords = useSetLeadRecords();

  const leadRecords = useLeadRecords();

  const selectedLeadsArray = useSelectedLeadsArray();

  const setSelectedLeadsArray = useSetSelectedLeadsArray();

  const removedLeadsArray = useRemovedLeadsArray();

  const setRemoveLeadsArray = useSetRemovedLeadsArray();

  const onClick = (): void => {
    const newRecords = leadRecords?.filter((rec) => rec?.id !== record.id);
    setLeadRecords(newRecords);
    const newUnAugmentedRecord = selectedLeadsArray?.filter((rec) => rec?.ProspectID !== record.id);
    setSelectedLeadsArray(newUnAugmentedRecord);
    const newRemovedLeadsArray = removedLeadsArray?.filter((id) => id !== record.id);
    setRemoveLeadsArray([record.id, ...newRemovedLeadsArray]);
    if (!newRecords?.length) {
      setShowLeadGrid(false);
      setDisabledSave(true);
    }
  };

  return (
    <div onClick={onClick} className={styles.cancel_button}>
      <Tooltip
        content="Remove"
        trigger={[Trigger.Hover]}
        placement={Placement.Vertical}
        theme={Theme.Dark}>
        <Icon name="cancel" customStyleClass={styles.custom_icon_style} />
      </Tooltip>
    </div>
  );
};

export default CancelAction;
