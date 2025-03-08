import { render, screen, waitFor } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea', () => {
  test('Should render value with split by "\n" when value contain "\n" in it', async () => {
    //Arrange
    const testValue = 'Line 1\nLine 2\nLine 3';
    render(<TextArea value={testValue} />);

    //Act
    const textArea = screen.getByTestId('entity-field-textarea');

    //Assert
    await waitFor(() => {
      expect(textArea).toBeInTheDocument();
      expect(textArea).toHaveTextContent('Line 1');
      expect(textArea).toHaveTextContent('Line 2');
      expect(textArea).toHaveTextContent('Line 3');
    });
  });

  // test('Should render ellipses when value exceeds WORD_LIMIT', () => {
  //   //Arrange
  //   const testValue = 'Lorem ipsum '.repeat(20);
  //   render(<TextArea value={testValue} />);

  //   //Act
  //   const textArea = screen.getByTestId('entity-field-textarea');

  //   //Assert
  //   expect(textArea).toBeInTheDocument();
  //   expect(textArea).toHaveTextContent(
  //     'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ...'
  //   );
  // });

  test('Should render without ellipses when value is within WORD_LIMIT', () => {
    //Arrange
    const testValue = 'Short text within the limit';
    render(<TextArea value={testValue} />);

    //Act
    const textArea = screen.getByTestId('entity-field-textarea');

    //Assert
    expect(textArea).toBeInTheDocument();
    expect(textArea).not.toHaveTextContent('...');
  });

  test('Should render empty value when value provided as empty string', () => {
    render(<TextArea value="" />);

    const textArea = screen.getByTestId('entity-field-textarea');
    expect(textArea).toBeInTheDocument();
    expect(textArea).toHaveTextContent('');
  });
});
