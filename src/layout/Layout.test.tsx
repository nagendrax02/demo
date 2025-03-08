import { render, screen, waitFor } from '@testing-library/react';
import Layout from './Layout';
import { useAuthenticationStatus } from 'common/utils/authentication';

jest.mock('common/utils/authentication', () => ({ useAuthenticationStatus: jest.fn() }));

describe('Layout', () => {
  it('Should render the layout when authentication is successful', async () => {
    //Arrange
    (useAuthenticationStatus as jest.Mock).mockImplementation(() => ({
      authStatus: {
        isLoading: false,
        isSuccess: true
      },
      setAuthStatus: () => {}
    }));

    //Act
    render(<Layout />);

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('layout-page-container')).toBeInTheDocument();
    });
  });
});
