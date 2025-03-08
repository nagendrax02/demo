import { render } from '@testing-library/react';
import BodyWrapper from './BodyWrapper';

describe('BodyWrapper', () => {
  // Arrange
  const childText = 'Test Child';
  const children = <div>{childText}</div>;

  it('should renders children correctly', () => {
    // Act
    const { getByText } = render(<BodyWrapper>{children}</BodyWrapper>);

    // Assert
    expect(getByText(childText)).toBeInTheDocument();
  });

  it('Should apply the correct CSS class', () => {
    // Act
    const { container } = render(<BodyWrapper>{children}</BodyWrapper>);

    // Assert
    expect(container.firstChild).toHaveClass('body');
  });
});
