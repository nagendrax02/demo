import { Suspense } from 'react';
import AssociatedLeadDropdown from 'common/component-lib/associated-leads-dropdown';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './assign-leads.module.css';

import { gridKey, scheduleEmailColDefs } from './constants';
import { IAssignedLeadsCols } from './assign-leads.types';
import { augmentRecord } from './utils';
import useAssignLeadsStore, {
  useLeadRecords,
  useRemovedLeadsArray,
  useSelectedLeadsArray,
  useSetLeadRecords,
  useSetSelectedLeadsArray
} from './assignleads.store';
import Grid, { GridShimmer } from '@lsq/nextgen-preact/grid';
import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

interface IModalBody {
  accountId: string;
}

const ModalBody = (props: IModalBody): JSX.Element => {
  const { accountId } = props;
  const setLeadRecords = useSetLeadRecords();
  const leadRecords = useLeadRecords();
  const selectedLeadsArray = useSelectedLeadsArray();
  const setSelectedLeadsArray = useSetSelectedLeadsArray();
  const removedLeadsArray = useRemovedLeadsArray();

  const { showLeadGrid, setShowLeadGrid, setDisabledSave } = useAssignLeadsStore();

  const handleSelection = (options: IOption[]): void => {
    if (options?.length) {
      const isLeadPresent = selectedLeadsArray?.some(
        (item) => item?.ProspectID === options[0]?.metaData?.ProspectID
      );
      if (!isLeadPresent && options[0]?.metaData) {
        const leads = [...selectedLeadsArray, options[0].metaData];
        setSelectedLeadsArray(leads);
        const getAugmentedLeadArray = augmentRecord(leads);
        setLeadRecords(getAugmentedLeadArray);
      }
      setDisabledSave(false);
      setShowLeadGrid(true);
    } else {
      if (!selectedLeadsArray?.length) {
        setShowLeadGrid(true);
        setDisabledSave(true);
      }
    }
  };

  return (
    <div className={styles.assign_leads_body_wrapper}>
      <AssociatedLeadDropdown
        entityId={accountId}
        selectedLeadsArray={selectedLeadsArray}
        removedLeadsArray={removedLeadsArray}
        handleSelection={handleSelection}
        doNotSetDropdownValue
      />
      <div className={styles.grid_container}>
        {showLeadGrid ? (
          <Suspense fallback={<GridShimmer rows={5} columns={4} />}>
            <Grid<IAssignedLeadsCols>
              gridKey={gridKey}
              columnDefs={scheduleEmailColDefs}
              records={leadRecords || []}
              showCustomStyle
              theme={getCurrentTheme()}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default ModalBody;
