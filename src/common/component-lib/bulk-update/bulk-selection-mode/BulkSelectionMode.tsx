import { lazy } from 'react';
import { getSelectedFieldValue, useBulkUpdate } from '../bulk-update.store';
import { EntityType } from 'common/types';
import { withShimmer } from '../components/withShimmer';
const LeadBulkSelectionMode = withShimmer(lazy(() => import('./LeadBulkSelectionMode')));
const ActivityBulkSelectionMode = withShimmer(lazy(() => import('./ActivityBulkSelectionMode')));

const BulkSelectionMode = (): JSX.Element => {
  const { initGridConfig } = getSelectedFieldValue();

  const settings = useBulkUpdate((state) => state.bulkUpdateConfig?.settings);
  const bulkConfig = useBulkUpdate((state) => state.initGridConfig?.gridConfig);
  const { PluralName } = useBulkUpdate((state) => state.representationName);
  const bulkSelectionMode = useBulkUpdate((state) => state.bulkSelectionMode);
  const setBulkSelectionMode = useBulkUpdate((state) => state.setBulkSelectionMode);
  const error = useBulkUpdate((state) => state.error);
  return (
    <>
      {initGridConfig?.entityType === EntityType.Lead ? (
        <LeadBulkSelectionMode
          settingConfig={settings}
          bulkConfig={bulkConfig}
          pluralRepName={PluralName}
          bulkSelectionMode={bulkSelectionMode}
          setBulkSelectionMode={setBulkSelectionMode}
          numberOfSelectedRecords={initGridConfig?.entityIds?.length}
          error={error}
        />
      ) : (
        <ActivityBulkSelectionMode />
      )}
    </>
  );
};

export default BulkSelectionMode;
