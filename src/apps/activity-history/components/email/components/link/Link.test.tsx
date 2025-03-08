import { render, screen } from '@testing-library/react';
import Link from './Link';

describe('Link', () => {
  test('Should render link text', () => {
    //Arrange
    render(<Link value="www.example.com" />);

    //Assert
    expect(screen.getByText('www.example.com')).toBeInTheDocument();
  });

  test('Should not render link when value is empty', () => {
    //Arrange
    const { container } = render(<Link value="" />);

    //Assert
    expect(container).toBeEmptyDOMElement();
  });
});
