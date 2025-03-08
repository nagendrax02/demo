import { render, fireEvent } from '@testing-library/react';
import Footer from '../tools/add-link/Footer';

describe('Footer', () => {
  const mockSetOpenInNewTab = jest.fn();
  const mockHandleSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render component', () => {
    // Act
    const { getByTestId } = render(
      <Footer
        openInNewTab={false}
        setOpenInNewTab={mockSetOpenInNewTab}
        handleSubmit={mockHandleSubmit}
      />
    );

    // Assert
    expect(getByTestId('add-link-footer')).toBeInTheDocument();
  });

  it('Should handle submit button click', () => {
    // Arrange
    const { getByText } = render(
      <Footer
        openInNewTab={false}
        setOpenInNewTab={mockSetOpenInNewTab}
        handleSubmit={mockHandleSubmit}
      />
    );

    // Act
    fireEvent.click(getByText('Insert'));

    // Assert
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
