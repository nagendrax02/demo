import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Error from './Error';

const icon = 'icon';
const title = 'tittle';
const description = 'description';
const actionConfig = {
  title: 'Action',
  handleClick: jest.fn()
};

describe('Error', () => {
  it('Should render the icon, title, description when provided', () => {
    //Arrange
    render(<Error icon={icon} title={title} description={description} />);

    //Assert
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('error-title')).toBeInTheDocument();
    expect(screen.getByTestId('error-description')).toBeInTheDocument();
  });

  it('Should not render the action button when actionConfig is not provided', () => {
    //Arrange
    render(<Error icon={icon} title={title} description={description} />);
    const actionButton = screen.queryByTestId('error-action');

    //Assert
    expect(actionButton).toBeNull();
  });

  it('Should render the action button when actionConfig is provided', async () => {
    //Arrange
    render(
      <Error icon={icon} title={title} description={description} actionConfig={actionConfig} />
    );

    await waitFor(() => {
      const actionButton = screen.getByTestId('error-action');

      //Act
      fireEvent.click(actionButton);

      //Assert
      expect(actionButton).toBeInTheDocument();
      expect(actionButton).toHaveTextContent(actionConfig.title);
      expect(actionConfig.handleClick).toHaveBeenCalled();
    });
  });
});
