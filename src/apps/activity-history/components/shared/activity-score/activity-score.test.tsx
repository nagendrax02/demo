import { render } from '@testing-library/react';
import ActivityScore from './ActivityScore';

describe('ActivityScore Component', () => {
  test('Should render null if activityScore is an empty string', () => {
    // Act
    const { container } = render(<ActivityScore activityScore="" />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  test('Should render null if activityScore is "0"', () => {
    // Act
    const { container } = render(<ActivityScore activityScore="0" />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  test('Should render a positive score with a "+" sign', () => {
    // Act
    const { getByText } = render(<ActivityScore activityScore="5" />);

    // Assert
    expect(getByText('+5')).toBeInTheDocument();
  });

  test('Should render a negative score without a "+" sign', () => {
    // Act
    const { getByText } = render(<ActivityScore activityScore="-3" />);

    // Assert
    expect(getByText('-3')).toBeInTheDocument();
  });

  test('Should render null if activityScore is not a valid number', () => {
    // Act
    const { container } = render(<ActivityScore activityScore="invalid" />);

    // Assert
    expect(container.firstChild).not.toHaveClass('positive_score');
  });

  test('Should apply styles for positive score', () => {
    // Act
    const { container } = render(<ActivityScore activityScore="7" />);

    // Assert
    expect(container.firstChild).toHaveClass('positive_score');
  });

  test('Should apply styles for non-positive score', () => {
    // Act
    const { container } = render(<ActivityScore activityScore="-2" />);

    // Assert
    expect(container.firstChild).not.toHaveClass('positive_score');
  });
});
