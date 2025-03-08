import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, lazy, useMemo } from 'react';
import {
  getTabData,
  setResetQuickFilterOptions,
  useActiveTab,
  useQuickFilter,
  useSmartViewSecondaryHeader
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import styles from './quick-filter.module.css';
import {
  convertToQuickFilterOption,
  fetchQuickFilters,
  getTriggerLeftIcon,
  getStyles,
  menuItemSelectionHandler,
  recordDeleteApiCall,
  getTriggerRightIcon,
  getValidQuickFilter
} from './utils';
import {
  IQuickFilterOption,
  IQuickFilterResponse,
  IShowDeleteModal,
  IShowEditQuickFilter
} from './quick-filter.types';
import { Variant } from 'common/types';
import EditQuickFilter from '../edit-quick-filter';
import withSuspense from '@lsq/nextgen-preact/suspense';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';
import { QUICK_FILTER_DEFAULT_OPTION } from './constant';
import { Button } from '@lsq/nextgen-preact/v2/button';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

const showEditQuickFilter = (props: IShowEditQuickFilter): JSX.Element => {
  const { itemSelected, showEditModal, setShowEditModal, leadTypeInternalName } = props;
  return (
    <EditQuickFilter
      itemSelected={itemSelected}
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      leadTypeInternalName={leadTypeInternalName}
    />
  );
};

const showDeleteModal = (props: IShowDeleteModal): JSX.Element => {
  const { setShowDelete, showDelete, itemSelected, handleRecordDelete, loading } = props;
  return (
    <ConfirmationModal
      onClose={() => {
        setShowDelete({ showDeleteModal: false, itemDeleteSuccessFully: false });
      }}
      show={showDelete.showDeleteModal}
      title="Delete Quick Filter"
      description={`Are you sure you want to delete "${itemSelected?.Name}"? This operation can't be undone`}
      buttonConfig={[
        {
          id: 1,
          name: 'No',
          variant: Variant.Primary,
          onClick: (): void => {
            setShowDelete({ showDeleteModal: false, itemDeleteSuccessFully: false });
          }
        },
        {
          id: 2,
          name: <span className={styles.delete_text}>Yes, Delete</span>,
          variant: Variant.Secondary,
          onClick: handleRecordDelete,
          showSpinnerOnClick: true,
          isDisabled: loading
        }
      ]}
    />
  );
};

const QuickFilter = (): JSX.Element => {
  const activeTab = useActiveTab();
  const tabData = getTabData(activeTab);
  const quickFilter = useQuickFilter(activeTab);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<IQuickFilterResponse>();
  const [showDelete, setShowDelete] = useState({
    showDeleteModal: false,
    itemDeleteSuccessFully: false
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IQuickFilterOption>(
    convertToQuickFilterOption(getValidQuickFilter(quickFilter))
  );
  const resetQuickFilterOptions =
    useSmartViewSecondaryHeader(activeTab).quickFilterConfig?.resetQuickFilterOptions;

  useMemo(() => {
    setSelectedOption(convertToQuickFilterOption(getValidQuickFilter(quickFilter)));
  }, [quickFilter]);

  const handleDelete = (item: IQuickFilterResponse): void => {
    setShowDelete({ showDeleteModal: true, itemDeleteSuccessFully: false });
    setItemSelected(item);
  };

  const handleRecordDelete = async (): Promise<void> => {
    try {
      setLoading(true);
      await recordDeleteApiCall({ itemSelected });
      setShowDelete({ showDeleteModal: false, itemDeleteSuccessFully: true });
      if (quickFilter?.ID === itemSelected?.ID) {
        menuItemSelectionHandler({
          selectedQuickFilter: convertToQuickFilterOption(QUICK_FILTER_DEFAULT_OPTION),
          activeTab
        });
      }
      setResetQuickFilterOptions(activeTab);
    } catch (error) {
      trackError(error);
    }
    setLoading(false);
  };

  const handleEdit = (item: IQuickFilterResponse): void => {
    setShowEditModal(true);
    setItemSelected(item);
  };

  const fetchData = async (): Promise<IQuickFilterOption[]> => {
    return fetchQuickFilters({
      handleDelete,
      handleEdit,
      activeTab
    });
  };

  const handleSelection = (item: IQuickFilterOption | undefined): void => {
    let selectedQuickFilter = convertToQuickFilterOption(QUICK_FILTER_DEFAULT_OPTION);
    if (item) {
      const { customComponent, ...rest } = item;
      selectedQuickFilter = rest;
    }

    setSelectedOption(selectedQuickFilter);
    menuItemSelectionHandler({
      selectedQuickFilter,
      activeTab
    });
  };

  return (
    <>
      <SingleSelect
        fetchOptions={fetchData}
        onSelection={(item: IQuickFilterOption) => {
          handleSelection(item);
        }}
        open={open}
        onOpenChange={setOpen}
        refetchOptions={resetQuickFilterOptions}
        selectedOption={selectedOption}>
        <Button
          text={selectedOption.label}
          rightIcon={getTriggerRightIcon(open)}
          onClick={(): void => {}}
          dataTestId="quick-filter"
          customStyleClass={getStyles(selectedOption, open)}
          icon={getTriggerLeftIcon(selectedOption)}
        />
      </SingleSelect>
      <div className={styles.quick_filter_seperator} />
      {showDelete.showDeleteModal
        ? showDeleteModal({
            setShowDelete,
            showDelete,
            itemSelected,
            handleRecordDelete,
            loading
          })
        : null}
      {showEditModal
        ? showEditQuickFilter({
            itemSelected,
            showEditModal,
            setShowEditModal,
            leadTypeInternalName: tabData?.leadTypeConfiguration?.[0]?.LeadTypeInternalName ?? ''
          })
        : null}
    </>
  );
};

export default QuickFilter;
