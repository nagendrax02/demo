import { render, screen } from '@testing-library/react';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('Should render the Error page when known error is given', () => {
    //Arrange
    const mockError = new Error('Invalid Entity Id');

    // Act
    render(<ErrorPage error={mockError} />);

    //Assert
    expect(screen.getByTestId('entity-details-error-page-container')).toBeInTheDocument();
  });
});
