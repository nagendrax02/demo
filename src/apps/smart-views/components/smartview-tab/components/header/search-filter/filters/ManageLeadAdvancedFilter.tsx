import EditQuickFilter from '../edit-quick-filter';
import {
  getTabData,
  useActiveTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

const ManageLeadAdvancedFilter = ({
  showAdvanceSearchModal,
  setShowAdvanceSearchModal
}: {
  showAdvanceSearchModal: boolean;
  setShowAdvanceSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element | null => {
  const activeTab = useActiveTab();
  const tabData = getTabData(activeTab);
  const quickFilter = tabData?.headerConfig?.secondary?.quickFilterConfig?.quickFilter;

  return showAdvanceSearchModal ? (
    <EditQuickFilter
      itemSelected={quickFilter}
      showEditModal={showAdvanceSearchModal}
      setShowEditModal={setShowAdvanceSearchModal}
      leadTypeInternalName={tabData?.leadTypeConfiguration?.[0]?.LeadTypeInternalName}
    />
  ) : null;
};

export default ManageLeadAdvancedFilter;
