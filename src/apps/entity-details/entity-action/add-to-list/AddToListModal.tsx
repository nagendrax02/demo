/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { lazy } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import { CREATE_NEW_LIST, IAddToListModal } from './add-to-list.types';
import styles from './add-to-list.module.css';
import CreateNewList from './CreateNewList';
import { Variant } from 'src/common/types';
import { fetchOption } from './utils';
import LeadBulkSelectionMode from 'common/component-lib/bulk-update/bulk-selection-mode/LeadBulkSelectionMode';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));
const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));
const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

const AddToListModal = (props: IAddToListModal): JSX.Element => {
  const {
    handleClose,
    leadRepresentationName,
    selectedOption,
    showError,
    createNewListSelected,
    setCreateNewListSelected,
    handleSelection,
    listName,
    handleListNameChange,
    handleMessageChange,
    handleApiCall,
    message,
    disabledSave,
    bulkAddToListConfig,
    leadTypeInternalName
  } = props;

  const {
    pageConfig,
    handleModeSelection,
    config,
    settingConfig,
    bulkSelectionMode,
    isAsyncRequest,
    bulkNLeadError
  } = bulkAddToListConfig || {};

  return (
    <Modal show customStyleClass={styles.modal_container}>
      <Modal.Header
        title="Add to List"
        onClose={(): void => {
          handleClose();
        }}
      />
      <Modal.Body
        customStyleClass={`${styles.body_container} ${
          selectedOption?.[0]?.value === CREATE_NEW_LIST.value ? styles.create_list_selected : ''
        }`}>
        <>
          {isAsyncRequest ? (
            <div className={styles.async_style}>
              Your bulk update request has been queued. You will be notified when the process is
              complete.
            </div>
          ) : (
            <>
              {pageConfig ? (
                <LeadBulkSelectionMode
                  bulkConfig={config}
                  pluralRepName={leadRepresentationName?.PluralName}
                  bulkSelectionMode={bulkSelectionMode}
                  setBulkSelectionMode={handleModeSelection}
                  settingConfig={settingConfig}
                  actionType="addToList"
                  numberOfSelectedRecords={pageConfig?.noOfRecords}
                  error={bulkNLeadError}
                />
              ) : null}
              <div className={styles.body_header}>
                Select list where you want to add selected &nbsp;
                <div
                  title={leadRepresentationName?.SingularName}
                  className={styles.representation_name}>
                  {leadRepresentationName ? leadRepresentationName?.SingularName : 'Lead'}
                </div>
                <span className={styles.restricted}>*</span>
              </div>
              <div className={styles.add_dropdown_container} data-testid="dropdown-container-list">
                <Dropdown
                  fetchOptions={(search: string) =>
                    fetchOption({
                      leadRepresentationName: leadRepresentationName,
                      searchKeyWord: search,
                      leadTypeInternalName: leadTypeInternalName ?? ''
                    })
                  }
                  setSelectedValues={handleSelection}
                  showCheckIcon
                  selectedValues={selectedOption}
                  showDefaultFooter
                  hideClearButton
                  placeHolderText="Select"
                  error={showError.dropdown}
                  customFooter={
                    <CreateNewList
                      createNewListSelected={createNewListSelected}
                      setCreateNewListSelected={setCreateNewListSelected}
                      handleSelection={handleSelection}
                    />
                  }
                />
                {selectedOption?.[0]?.value !== CREATE_NEW_LIST.value ? (
                  <div className={styles.error_text}>
                    {showError.dropdown ? showError.errorMsg : null}
                  </div>
                ) : null}
              </div>
              {createNewListSelected ? (
                <>
                  <div className={styles.name_container}>
                    <div className={styles.title}>
                      List Name
                      <span className={styles.restricted}>*</span>
                    </div>

                    <input
                      type="text"
                      className={`${styles.input} ${showError.listName ? styles.error_input : ''}`}
                      value={listName}
                      onChange={handleListNameChange}
                      data-testid="name-container-field"
                      placeholder="Enter List Name"
                      maxLength={100}
                    />
                    <div className={styles.error_text}>
                      {showError.listName ? showError.errorMsg : null}
                    </div>
                  </div>
                  <div className={styles.description_container}>
                    <div className={styles.title}>Description</div>
                    <TextArea
                      handleMessageChange={handleMessageChange}
                      message={message}
                      placeholder="Enter Description"
                      maxLength={200}
                    />
                  </div>
                </>
              ) : null}

              {pageConfig ? (
                <div
                  className={`${styles.info_text} ${
                    selectedOption?.[0]?.value === CREATE_NEW_LIST.value
                      ? styles.create_list_selected_with_info_text
                      : ''
                  }`}>
                  Automations will be triggered as per your license
                </div>
              ) : null}
            </>
          )}
        </>
      </Modal.Body>
      <Modal.Footer>
        <>
          {isAsyncRequest ? (
            <Button
              text="Close"
              onClick={(): void => {
                handleClose();
              }}
              variant={Variant.Secondary}
            />
          ) : (
            <>
              <Button
                dataTestId="ok-button"
                text="Add"
                onClick={handleApiCall}
                isLoading={disabledSave}
                disabled={disabledSave}
                variant={Variant.Primary}
              />
              <Button
                text="Cancel"
                onClick={(): void => {
                  handleClose();
                }}
                variant={Variant.Secondary}
              />
            </>
          )}
        </>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToListModal;
