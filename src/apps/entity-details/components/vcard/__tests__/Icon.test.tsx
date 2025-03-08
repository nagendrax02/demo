import { render, screen } from '@testing-library/react';
import Icon from '../icon';
import { IconContentType } from '../../../types';

const testProps = {
  config: undefined,
  isLoading: false,
  customStyleClass: 'custom-class'
};

describe('Icon', () => {
  it('Should render Shimmer when loading state is true', () => {
    // Act
    render(<Icon {...testProps} isLoading={true} />);

    // Assert
    expect(screen.getByTestId('icon-shimmer')).toBeInTheDocument();
  });

  it('Should render image when content type is image', () => {
    // Arrange
    const props = {
      ...testProps,
      config: {
        contentType: IconContentType.Image,
        content: 'test-image-src'
      }
    };

    // Act
    render(<Icon {...props} />);

    // Assert
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image-src');
  });

  it('Should render text when content type is text', () => {
    // Arrange
    const props = {
      ...testProps,
      config: {
        contentType: IconContentType.Text,
        content: 'test-content'
      }
    };

    // Act
    render(<Icon {...props} />);

    // Assert
    expect(screen.getByText('test-content')).toBeInTheDocument();
  });
});
