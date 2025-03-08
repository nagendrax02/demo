import { render, screen } from '@testing-library/react';
import Badge from '../badge';

const testConfig = { content: 'Test Badge' };

describe('Badge', () => {
  it('Should render badge when content is passed', () => {
    // Act
    render(<Badge isLoading={false} config={testConfig} />);

    // Assert
    const badgeElement = screen.getByText('Test Badge');
    expect(badgeElement).toBeInTheDocument();
  });

  it('Should render shimmer when loading state is true', () => {
    // Act
    render(<Badge isLoading={true} config={testConfig} />);

    // Assert
    const shimmerElement = screen.getByTestId('badge-shimmer');
    expect(shimmerElement).toBeInTheDocument();
  });
});
