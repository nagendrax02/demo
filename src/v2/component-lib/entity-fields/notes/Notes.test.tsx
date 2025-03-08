import Notes from './Notes';
import { render, screen, waitFor } from '@testing-library/react';

//Arrange
const inputValue = '<p>Test content</p>';
const outputValue = 'Test content';

describe('GetPurifiedContent', () => {
  it('Should render notes as purified data when un-purified data is given as input', async () => {
    //Arrange
    render(<Notes value={inputValue} />);

    await waitFor(() => {
      //Act
      const notesElement = screen.getByTestId('notes');

      //Assert
      expect(notesElement).toBeInTheDocument();
      expect(notesElement).toHaveTextContent(outputValue);
    });
  });
});
