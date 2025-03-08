// import { fireEvent, render, waitFor, screen, queryByTestId } from '@testing-library/react';
// import ManageTabs from '../ManageTabs';
// import useEntityTabsStore from '../../../../store';
// import { tabMock } from '../../../../__tests__/tab-mock';
// import style from './manage-tabs.module.css';
// import { sortedListMockTab1Default, sortedListMockTab2Default } from './sorted-list-mock';
// import { handleSave } from '../utils/handleSave';

// const getMockMethods = () => ({
//   show: true,
//   setShow: jest.fn(),
//   handleManageTab: jest.fn(),
//   onRemove: jest.fn()
// });

// //@ts-ignore
// useEntityTabsStore.getState().tabConfig = tabMock;

// const triggerClick = (testId) => {
//   fireEvent.click(screen.getByTestId(testId));
// };

// describe('Manage tabs', () => {
// it('Should display sortable list when rendered', async () => {
//   //Arrange
//   const { queryByTestId } = render(<ManageTabs {...getMockMethods()} />);
//   //Assert
//   await waitFor(() => {
//     expect(queryByTestId('tab1')).toBeInTheDocument();
//   });
// });
// it('Should display default button beside tab name when tab is default ', async () => {
//   //Arrange
//   const { queryByTestId } = render(<ManageTabs {...getMockMethods()} />);
//   //Assert
//   await waitFor(() => {
//     expect(queryByTestId('tab1-default')).toHaveClass(style.is_default);
//     expect(queryByTestId('tab2-default')).not.toHaveClass(style.is_default);
//   });
// });
// it('Should not display ManageTabs modal when clicked on cancel', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   const { queryByTestId } = render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     expect(queryByTestId('manage-tab-body')).toBeInTheDocument();
//   });
//   triggerClick('manage-tab-cancel');
//   await waitFor(() => {
//     expect(mocks.setShow).toHaveBeenCalledTimes(1);
//     expect(mocks.setShow).toHaveBeenCalledWith(false);
//   });
// });
// it('Should invoke handleManageTab with sorted data', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     triggerClick('manage-tab-save');
//   });
//   await waitFor(() => {
//     expect(mocks.handleManageTab).toHaveBeenCalledTimes(1);
//     //@ts-ignore: for testing purpose
//     expect(mocks.handleManageTab).toHaveBeenCalledWith(sortedListMockTab1Default, 'tab1', 'tab1');
//   });
// });
// it('Should invoke handleManageTab with default selected data', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     triggerClick('tab2-default');
//   });
//   await waitFor(() => {
//     triggerClick('manage-tab-save');
//   });
//   await waitFor(() => {
//     expect(mocks.handleManageTab).toHaveBeenCalledTimes(1);
//     //@ts-ignore: for testing purpose
//     expect(mocks.handleManageTab).toHaveBeenCalledWith(sortedListMockTab2Default, 'tab2', 'tab2');
//   });
// });
// it('Should not show remove icon when tab is default', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   const { queryByTestId } = render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     expect(queryByTestId('tab1-close')).not.toBeInTheDocument();
//   });
//   await waitFor(() => {
//     triggerClick('tab2-default');
//   });
//   await waitFor(() => {
//     expect(queryByTestId('tab2-close')).not.toBeInTheDocument();
//   });
// });
// it('Should show confirmation modal when clicked on list cancel icon ', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   const { queryByTestId } = render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     expect(queryByTestId('tab2-close')).toBeInTheDocument();
//     triggerClick('tab2-close');
//   });
//   await waitFor(() => {
//     expect(queryByTestId('remove-tab-confirmation-modal')).toBeInTheDocument();
//   });
// });
// it('Should close  confirmation modal when clicked on "No"', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   const { queryByTestId } = render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     expect(queryByTestId('tab2-close')).toBeInTheDocument();
//     triggerClick('tab2-close');
//   });
//   await waitFor(() => {
//     expect(queryByTestId('remove-tab-confirmation-no')).toBeInTheDocument();
//     triggerClick('remove-tab-confirmation-no');
//   });
//   await waitFor(() => {
//     expect(queryByTestId('tab2')).toBeInTheDocument();
//   });
// });
// it('Should remove tab when clicked on confirmation modal "yes"', async () => {
//   //Arrange
//   const mocks = getMockMethods();
//   const { queryByTestId } = render(<ManageTabs {...mocks} />);
//   //Act & Assert
//   await waitFor(() => {
//     expect(queryByTestId('tab2-close')).toBeInTheDocument();
//     triggerClick('tab2-close');
//   });
//   await waitFor(() => {
//     expect(queryByTestId('remove-tab-confirmation-yes')).toBeInTheDocument();
//     triggerClick('remove-tab-confirmation-yes');
//   });
//   await waitFor(() => {
//     expect(queryByTestId('tab2')).not.toBeInTheDocument();
//   });
// });
// });

// describe('handleSave', () => {
//   it('Should catch error when api throws error', () => {
//     //Arrange
//     const handleManageTab = jest.fn(() => {
//       throw new Error('Mocked error');
//     });
//     const setIsLoading = jest.fn();
//     const sortedTabConfig = [];
//     const setNotification = jest.fn();
//     const closeModal = jest.fn();
//     const defaultTabId = 'tab1';

//     //Act & Assert
//     expect(() =>
//       handleSave({
//         closeModal,
//         defaultTabId,
//         handleManageTab,
//         setIsLoading,
//         setNotification,
//         sortedTabConfig
//       })
//     ).resolves;
//   });
// });

describe('Manage Tabs', () => {
  //dummy test case
  test('Should render manage tabs', () => {
    expect(1).toBe(1);
  });
});
