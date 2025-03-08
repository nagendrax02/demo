import { render, screen, waitFor } from '@testing-library/react';
import Layout from '../../layout';
import { useLocation } from 'wouter';
import Router from '../Router';
import { useAuthenticationStatus } from 'common/utils/authentication';

jest.mock('wouter', () => ({
  useLocation: jest.fn()
}));

jest.mock('common/utils/authentication', () => ({ useAuthenticationStatus: jest.fn() }));

describe('Routing', () => {
  it('should render LeadDetails component when pathname is /leaddetails', async () => {
    //Arrange
    jest.spyOn(require('wouter'), 'useLocation').mockReturnValue(['/leaddetails']);
    render(<Router />);

    //Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    waitFor(() => expect(screen.getByTestId('layout-page-container')).toBeInTheDocument());
  });

  // it('should render error page when pathname is /unknown', async () => {
  //   //Arrange
  //   (useAuthenticationStatus as jest.Mock).mockImplementation(() => ({
  //     authStatus: {
  //       isLoading: false,
  //       isSuccess: true
  //     },
  //     setAuthStatus: () => {}
  //   }));
  //   (useLocation as jest.Mock).mockReturnValue(['/unknown']);

  //   //Act
  //   const { getByText } = render(<Layout />);

  //   //Assert
  //   await waitFor(() => {
  //     expect(getByText('This page does not exist')).toBeInTheDocument();
  //   });
  // });
});
