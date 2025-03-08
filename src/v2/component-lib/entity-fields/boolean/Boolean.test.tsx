import { render, screen } from '@testing-library/react';
import Boolean from './Boolean';

describe('Boolean', () => {
  it('Should render Yes when 1 is being passed as value', () => {
    //Act
    const { container } = render(<Boolean value="1" />);
    //Assert
    expect(container.textContent).toBe('Yes');
  });

  it('Should render No when 0 is being passed as value', () => {
    //Act
    const { container } = render(<Boolean value="0" />);
    //Assert
    expect(container.textContent).toBe('No');
  });

  it('Should render the value passed when value is not either 1 or 0', () => {
    //Act
    const { container } = render(<Boolean value="hello world" />);
    //Assert
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
