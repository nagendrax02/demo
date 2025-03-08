import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import ChangeOwner from '../ChangeOwner';
import * as restClient from 'common/utils/rest-client';

//Arrange
const mockedApiResult = {
  Options: [
    {
      value: 'abc',
      label: 'abc'
    },
    {
      value: 'Opportunity',
      label: 'Opportunity'
    }
  ]
};

const setSelectedOption = jest.fn();

describe('ChangeOwner', () => {
  it('Should Render the change owner component when default props is passed', async () => {
    //Arrange
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    // Arrange;
    render(
      <ChangeOwner
        setShowError={jest.fn()}
        setSelectedOption={jest.fn()}
        showError={false}
        selectedOption={[]}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('owner-dropdown')).toBeInTheDocument();
      expect(screen.getByText('Select')).toBeInTheDocument();
    });
  });

  // test('Should open the option when dropdown is open', async () => {
  //   //Arrange
  //   jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);
  //   render(
  //     <ChangeOwner
  //       setShowError={jest.fn()}
  //       setSelectedOption={setSelectedOption}
  //       showError={false}
  //       selectedOption={[]}
  //     />
  //   );

  //   //Act
  //   // jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

  //   await waitFor(() => {
  //     //Assert
  //     const buttonDiv = screen.getByText('Select');
  //     fireEvent.click(buttonDiv);
  //     expect(screen.getByText('abc')).toBeInTheDocument();
  //   });
  // });

  // test('Should select the option when dropdown option is clicked', async () => {
  //   //Arrange
  //   jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);
  //   render(
  //     <ChangeOwner
  //       setShowError={jest.fn()}
  //       setSelectedOption={setSelectedOption}
  //       showError={false}
  //       selectedOption={[]}
  //     />
  //   );

  //   //Act
  //   // jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

  //   //Assert
  //   await waitFor(() => {
  //     const buttonDiv = screen.getByText('Select');
  //     fireEvent.click(buttonDiv);
  //     const option = screen.getByText('abc');
  //     fireEvent.click(option);
  //     expect(setSelectedOption).toHaveBeenCalledTimes(1);
  //   });
  // });
});
