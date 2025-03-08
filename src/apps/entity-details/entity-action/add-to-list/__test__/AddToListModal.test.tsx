import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddToListModal from '../AddToListModal';
import { InputId } from 'common/component-lib/bulk-update/bulk-update.types';

// Mocking the fetchOption function
jest.mock('../utils.ts', () => ({
  fetchOption: jest.fn(() =>
    Promise.resolve([
      { value: '1', label: 'List 1' },
      { value: '2', label: 'List 2' }
    ])
  )
}));

const handleModeSelection = jest.fn();

describe('AddToListModal', () => {
  //Arrange
  const mockProps = {
    handleClose: jest.fn(),
    leadRepresentationName: {
      SingularName: 'Lead',
      PluralName: 'Lead'
    },
    selectedOption: [{ label: 'testing', value: 'testing' }],
    showError: {
      dropdown: false,
      listName: false,
      errorMsg: 'List name is required'
    },
    createNewListSelected: false,
    setCreateNewListSelected: jest.fn(),
    handleSelection: jest.fn(),
    listName: 'List 1',
    handleListNameChange: jest.fn(),
    handleMessageChange: jest.fn(),
    handleApiCall: jest.fn(),
    message: 'Description of List 1',
    disabledSave: false
  };

  it('Should render AddToListModal when createNewListSelected true', async () => {
    //Arrange

    const props = { ...mockProps, createNewListSelected: true };
    render(
      <AddToListModal
        bulkAddToListConfig={{
          handleModeSelection: handleModeSelection,
          config: {
            isSelectAll: false,
            pageSize: 1,
            totalPages: 1,
            totalRecords: 1
          },
          settingConfig: {
            BulkLeadUpdateCount: '',
            EnableNLeadsFeature: '',
            MaxNLeadsToUpdateInSync: ''
          },
          bulkSelectionMode: {},
          isAsyncRequest: false,
          bulkNLeadError: InputId.Invalid
        }}
        {...props}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText('List Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter Description')).toBeInTheDocument();
    });
  });

  it('SHould handle the input changes in create new list scenario when changed list', () => {
    //Arrange
    const props = { ...mockProps, createNewListSelected: true };
    render(
      <AddToListModal
        bulkAddToListConfig={{
          handleModeSelection: handleModeSelection,
          config: {
            isSelectAll: false,
            pageSize: 1,
            totalPages: 1,
            totalRecords: 1
          },
          settingConfig: {
            BulkLeadUpdateCount: '',
            EnableNLeadsFeature: '',
            MaxNLeadsToUpdateInSync: ''
          },
          bulkSelectionMode: {},
          isAsyncRequest: false,
          bulkNLeadError: InputId.Invalid
        }}
        {...props}
      />
    );

    //Act
    const textarea = screen.getByPlaceholderText('Enter Description');
    const input = screen.getByTestId('name-container-field');

    fireEvent.change(textarea, { target: { value: 'New message' } });
    fireEvent.change(input, { target: { value: 'New message' } });

    //Assert
    expect(mockProps.handleMessageChange).toHaveBeenCalledWith(expect.any(Object));
    expect(mockProps.handleListNameChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('Should handle API call on Add to List when button clicked', () => {
    //Arrange

    const props = { ...mockProps, createNewListSelected: true };
    render(
      <AddToListModal
        bulkAddToListConfig={{
          handleModeSelection: handleModeSelection,
          config: {
            isSelectAll: false,
            pageSize: 1,
            totalPages: 1,
            totalRecords: 1
          },
          settingConfig: {
            BulkLeadUpdateCount: '',
            EnableNLeadsFeature: '',
            MaxNLeadsToUpdateInSync: ''
          },
          bulkSelectionMode: {},
          isAsyncRequest: false,
          bulkNLeadError: InputId.Invalid
        }}
        {...props}
      />
    );

    //Act
    const addToButton = screen.getByTestId('ok-button');
    fireEvent.click(addToButton);

    //Assert
    expect(mockProps.handleApiCall).toHaveBeenCalledTimes(1);
  });
  it('Should handle close modal when cancel button clicked', () => {
    //Arrange
    const props = { ...mockProps, createNewListSelected: true };
    render(
      <AddToListModal
        bulkAddToListConfig={{
          handleModeSelection: handleModeSelection,
          config: {
            isSelectAll: false,
            pageSize: 1,
            totalPages: 1,
            totalRecords: 1
          },
          settingConfig: {
            BulkLeadUpdateCount: '',
            EnableNLeadsFeature: '',
            MaxNLeadsToUpdateInSync: ''
          },
          bulkSelectionMode: {},
          isAsyncRequest: false,
          bulkNLeadError: InputId.Invalid
        }}
        {...props}
      />
    );

    //Act
    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);

    //Assert
    expect(mockProps.handleClose).toHaveBeenCalledTimes(1);

    //Act
    const closeIcon = screen.getByText('close');
    fireEvent.click(closeIcon);

    //Assert
    expect(mockProps.handleClose).toHaveBeenCalledTimes(2);
  });
});
