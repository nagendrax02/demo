import { render, screen } from '@testing-library/react';
import Title from '../title';

describe('Title', () => {
  it('Should render the title when content is passed', () => {
    // Arrange
    const config = { content: 'Test Title', className: 'testClass' };

    // Act
    render(<Title isLoading={false} config={config} />);

    // Assert
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('testClass');
  });

  it('Should render the shimmer when loading state is true', () => {
    // Arrange
    const config = { content: 'Test Title', className: 'testClass' };

    // Act
    render(<Title isLoading={true} config={config} />);

    // Assert
    const shimmerElement = screen.getByTestId('title-shimmer');
    expect(shimmerElement).toBeInTheDocument();
  });
});
