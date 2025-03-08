import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Name from './Name';

const longName = 'Custom Activity History Tab';
const shortName = 'Custom Activity H...';

describe('Name', () => {
  it('Should render name', async () => {
    //Arrange
    render(<Name text="Tab 1" />);

    //Assert
    await waitFor(() => {
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
    });
  });

  it('Should render lengthy name with ellipses', async () => {
    //Arrange
    render(<Name text={longName} />);

    //Assert
    await waitFor(() => {
      expect(screen.getByText(shortName)).toBeInTheDocument();
    });
  });

  it('Should render name in tooltip when character length is greater than 20', async () => {
    //Arrange
    render(<Name text={longName} />);

    //Act
    fireEvent.mouseEnter(screen.getByText(shortName));

    //Assert
    await waitFor(() => {
      expect(screen.getByText(longName)).toBeInTheDocument();
    });
  });
});
