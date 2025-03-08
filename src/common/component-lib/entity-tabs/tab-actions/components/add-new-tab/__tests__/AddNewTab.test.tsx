import { fireEvent, waitFor, screen, render } from '@testing-library/react';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import AddNewTab from '../AddNewTab';
import { addNewTabMock } from './add-new-tab';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from '../../../../../../constants';

const triggerClick = (testId) => {
  fireEvent.click(screen.getByTestId(testId));
};

const options = jest.fn((search): IOption[] => [
  {
    label: 'Text1',
    value: 'Text1'
  },
  {
    label: 'Text2',
    value: 'Text2',
    subOptions: [
      {
        label: 'Text21',
        value: 'Text21'
      },
      {
        label: 'Text22',
        value: 'Text22'
      }
    ]
  }
]);

jest.mock('common/utils/rest-client', () => ({
  httpPost: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('newTabId')
}));

jest.mock('apps/activity-history/components/filters/type-filter/utils', () => ({
  __esModule: true,
  fetchOptions: jest.fn().mockImplementation(() => options)
}));

beforeEach(() => {
  jest.restoreAllMocks();
});

const updateInput = async (queryByTestId, dataTestId) => {
  //Arrange

  const newTabName = 'new tab name';

  //Act
  await waitFor(() => {
    const input = queryByTestId(dataTestId);
    //@ts-ignore: for testing purpose
    fireEvent.change(input, {
      target: {
        value: newTabName
      }
    });
  });

  //Assert
  await waitFor(() => {
    expect(queryByTestId('add-new-tab-input')).toHaveValue(newTabName);
  });
};

const selectActivity = async (queryByTestId) => {
  await waitFor(() => {
    triggerClick('dropdown-input');
  });

  await waitFor(() => {
    expect(queryByTestId('dropdown-option-Text1')).toBeInTheDocument();
    triggerClick('dropdown-option-Text1');
  });

  await waitFor(() => {
    triggerClick('apply');
  });

  await waitFor(() => {
    expect(queryByTestId('placeholder')?.textContent).toBe('Text1');
  });
};

describe('Add New Tab', () => {
  it('Should show error when input or activity is not selected', async () => {
    //Arrange
    const handleManageTab = jest.fn();
    const setShow = jest.fn();
    const { queryByTestId } = render(
      <AddNewTab
        handleManageTab={handleManageTab}
        setShow={setShow}
        show
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );
    //Act & Assert
    await waitFor(() => {
      triggerClick('add-new-tab-save');
    });
    await waitFor(() => {
      expect(handleManageTab).toHaveBeenCalledTimes(0);
    });

    //when tab name  is not provided
    await waitFor(() => {
      expect(queryByTestId('add-new-tab-input-error')).toBeInTheDocument();
      expect(queryByTestId('add-new-tab-name-error')?.textContent).toBe('Required Field');
    });

    //when tab name is  provided, but not the activity
    await updateInput(queryByTestId, 'add-new-tab-input-error');
    triggerClick('add-new-tab-save');
    await waitFor(() => {
      expect(queryByTestId('input-container-error')).toBeInTheDocument();
      expect(queryByTestId('add-new-tab-filter-error')?.textContent).toBe('Required Field');
    });
  });

  it('Should close the modal when clicked on cancel button', async () => {
    //Arrange
    const handleManageTab = jest.fn();
    const setShow = jest.fn();
    render(
      <AddNewTab
        handleManageTab={handleManageTab}
        setShow={setShow}
        show
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Act
    await waitFor(() => {
      triggerClick('add-new-tab-cancel');
    });

    //Assert
    expect(setShow).toHaveBeenCalledTimes(1);
    expect(handleManageTab).toHaveBeenCalledTimes(0);
  });

  it('Should call handleManageTab with tab config including new tab when clicked on save', async () => {
    //Arrange
    jest.spyOn(global, 'crypto', 'get').mockReturnValue({
      //@ts-ignore: for testing purpose
      randomUUID: () => 'newTabId'
    });
    const handleManageTab = jest.fn();
    const setShow = jest.fn();
    const { queryByTestId } = render(
      <AddNewTab
        handleManageTab={handleManageTab}
        setShow={setShow}
        show
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Act and Assert
    await updateInput(queryByTestId, 'add-new-tab-input');
    await selectActivity(queryByTestId);
    triggerClick('add-new-tab-save');
    triggerClick('add-new-tab-set-default');
    await waitFor(() => {
      expect(handleManageTab).toHaveBeenCalledTimes(1);
      expect(handleManageTab).toHaveBeenCalledWith({
        tabConfiguration: addNewTabMock,
        activeTabId: 'newTabId',
        defaultTabId: undefined,
        callerSource: undefined
      });
    });
  });

  it('Should not call handleManageTab when crypto randomUUID is not defined', async () => {
    //Arrange
    //@ts-ignore: for testing purpose
    jest.spyOn(global, 'crypto', 'get').mockReturnValue({});
    const handleManageTab = jest.fn();
    const setShow = jest.fn();
    const { queryByTestId } = render(
      <AddNewTab
        handleManageTab={handleManageTab}
        setShow={setShow}
        show
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Act and Assert
    await updateInput(queryByTestId, 'add-new-tab-input');
    await selectActivity(queryByTestId);
    triggerClick('add-new-tab-save');
    triggerClick('add-new-tab-set-default');
    await waitFor(() => {
      expect(handleManageTab).toHaveBeenCalledTimes(0);
    });
  });
});
