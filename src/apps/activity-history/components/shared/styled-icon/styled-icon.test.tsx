import { render } from '@testing-library/react';
import StyledIcon from './StyledIcon';

describe('StyledIcon', () => {
  it('Should render with the correct icon name', () => {
    // Act
    const { getByText } = render(<StyledIcon name="exampleIcon" />);

    // Assert
    expect(getByText('exampleIcon')).toBeInTheDocument();
  });

  it('Should render with the correct wrapper class', () => {
    // Act
    const { getByTestId } = render(<StyledIcon name="exampleIcon" />);
    const wrapperElement = getByTestId('icon-wrapper');

    // Assert
    expect(wrapperElement).toBeInTheDocument();
    expect(wrapperElement).toHaveClass('icon_wrapper');
  });

  it('Should render with the correct icon class', () => {
    // Act
    const { getByTestId } = render(<StyledIcon name="exampleIcon" />);
    const iconElement = getByTestId('icon');

    // Assert
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('icon');
  });

  it('Should render children when passed', () => {
    // Act
    const { getByText } = render(
      <StyledIcon>
        <span>custom_icon</span>
      </StyledIcon>
    );

    // Assert
    expect(getByText('custom_icon')).toBeInTheDocument();
  });
});
