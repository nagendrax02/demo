import { render, screen, waitFor } from '@testing-library/react';
import UserName from '../UserName';
import * as utils from '../utils';
import { CallerSource } from 'common/utils/rest-client';

describe('UserName Component', () => {
  it('Should render loading state initially', () => {
    // Arrange
    render(<UserName id="1" callerSource={CallerSource.NA} />);

    // Assert
    expect(screen.getByTestId('shimmer')).toBeInTheDocument();
  });

  it('Should render the username after fetching', async () => {
    // Arrange
    const mockUserName = { 1: 'JohnDoe' };
    jest.spyOn(utils, 'getUserNames').mockResolvedValue(mockUserName);

    render(<UserName id="1" callerSource={CallerSource.NA} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(mockUserName[1])).toBeInTheDocument();
    });
    expect(screen.queryByTestId('shimmer')).toBeNull();
  });

  it('Should handle error during fetching', async () => {
    // Arrange
    const errorMessage = 'Fetching failed';
    jest.spyOn(utils, 'getUserNames').mockRejectedValue(errorMessage);
    const logSpy = jest.spyOn(global.console, 'error');

    render(<UserName id="1" callerSource={CallerSource.NA} />);

    // Assert
    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Fetching failed');
    });
    expect(screen.queryByTestId('shimmer')).toBeNull();
  });
});
