import { render, screen } from '@testing-library/react';
import MultiSelect from './MultiSelect';

describe('MultiSelect', () => {
  test('Should render value with semicolon and space separated when value is only separated by semicolon', () => {
    //Act
    render(<MultiSelect value="marvin;leadsquared" />);
    //Assert
    expect(screen.getByText('marvin; leadsquared')).toBeInTheDocument();
    expect(screen.getByTestId('multiselect-component')).toBeInTheDocument();
  });

  test('Should render value as it is when value provided does not contain semicolon separated data', () => {
    //Act
    render(<MultiSelect value="hello world" />);
    //Assert
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
