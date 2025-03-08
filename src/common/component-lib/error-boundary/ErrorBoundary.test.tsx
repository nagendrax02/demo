import { render, waitFor } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import logger from 'src/common/utils/logger';

describe('ErrorBoundary', () => {
  it('Should render the child component when no error occurs', () => {
    //Arrange
    const { queryByTestId } = render(
      <ErrorBoundary module="errorBoundary" key="errorBoundary">
        <div data-testid="child-component">Child Component</div>
      </ErrorBoundary>
    );

    //Assert
    expect(queryByTestId('child-component')).toBeInTheDocument();
    expect(queryByTestId('error-boundary-fallback')).toBeNull();
  });

  it('Should render the error fallback component when an error occurs', async () => {
    //Arrange
    const ChildComponent = () => {
      throw new Error('Test error');
    };
    logger.fatal = jest.fn().mockImplementation(() => {});

    const { getByTestId } = render(
      <ErrorBoundary module="errorBoundary" key="errorBoundary">
        <ChildComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      //Assert
      expect(getByTestId('error-boundary-fallback')).toBeInTheDocument();
    });
  });

  it('Should call fatal logger when an error occurs', async () => {
    //Arrange
    const ChildComponent = () => {
      throw new Error('Test error');
    };
    logger.fatal = jest.fn().mockImplementation(() => {});

    //Act
    render(
      <ErrorBoundary module="errorBoundary" key="errorBoundary">
        <ChildComponent />
      </ErrorBoundary>
    );

    //Assert
    await waitFor(() => {
      expect(logger.fatal).toHaveBeenCalled();
    });
  });
});
