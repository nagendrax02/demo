import Notes from './Notes';
import { render, screen, waitFor } from '@testing-library/react';

//Arrange
const inputValue = '<p>Test content</p>';
const outputValue = 'Test content';

describe('GetPurifiedContent', () => {
  it('Should render notes as purified data when un-purified data is given as input', async () => {
    //Arrange
    render(<Notes value={inputValue} showToolTip={false} />);

    await waitFor(() => {
      //Act
      const notesElement = screen.getByTestId('notes');

      //Assert
      expect(notesElement).toBeInTheDocument();
      expect(notesElement).toHaveTextContent(outputValue);
    });
  });

  it('Should render notes with ellipses when content exceeds word limit', async () => {
    //Arrange
    const value = `${'Lorem ipsum '.repeat(20)}`;
    render(<Notes value={value} showToolTip={false} />);

    await waitFor(() => {
      //Act
      const notes = screen.getByTestId('notes-render');

      //Assert
      expect(notes).toBeInTheDocument();
      expect(notes).toHaveTextContent(
        'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ...'
      );
    });
  });
});
