import { render, screen, waitFor } from '@testing-library/react';
import HandleAction from '.';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

//Arrange
const setActionClicked = jest.fn();

describe('ChangeStage', () => {
  test('Should render HandleAction when default props passed', async () => {
    //Arrange
    render(
      <HandleAction
        action={null}
        setActionClicked={setActionClicked}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Assert
    // await waitFor(() => {
    //   // expect(screen.getByTestId('handle-action')).toBeInTheDocument();
    // });
  });
});
