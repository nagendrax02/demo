import { render, fireEvent } from '@testing-library/react';
import CreateNewList from '../CreateNewList';

//Arrange
const createNewListSelected = true;
const setCreateNewListSelected = jest.fn();
const handleSelection = jest.fn();

describe('CreateNewList', () => {
  it('Should render CreateNewList when default props passed', () => {
    //Arrange
    const { getByText } = render(
      <CreateNewList
        createNewListSelected={createNewListSelected}
        setCreateNewListSelected={setCreateNewListSelected}
        handleSelection={handleSelection}
      />
    );

    //Act
    const createNewListText = getByText('Create New List');

    //Assert
    expect(createNewListText).toBeInTheDocument();
  });

  it('Should handle handleSelect and updates state when we select the option', () => {
    //Arrange
    const { getByText } = render(
      <CreateNewList
        createNewListSelected={false}
        setCreateNewListSelected={setCreateNewListSelected}
        handleSelection={handleSelection}
      />
    );

    //Act
    const createNewListContainer = getByText('Create New List');
    fireEvent.click(createNewListContainer);

    //Assert
    expect(setCreateNewListSelected).toHaveBeenCalledWith(true);
    expect(handleSelection).toHaveBeenCalledWith([
      {
        label: 'Create New List',
        value: 'create_new_list'
      }
    ]);
  });

  it('Should display check icon when createNewListSelected is true', () => {
    //Arrange
    const { getByText, getByTestId } = render(
      <CreateNewList
        createNewListSelected={true}
        setCreateNewListSelected={() => {}}
        handleSelection={() => {}}
      />
    );

    //Act
    const createNewListText = getByText('Create New List');
    const checkIcon = getByTestId('check-icon');

    //Assert
    expect(createNewListText).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });
});
