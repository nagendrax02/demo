import { render, screen } from '@testing-library/react';
import { extractHTMLContent, getPurifiedContent } from '../string-helper';

//Arrange
const unPurifiedData = '<a href="https://google.com">Link</a>';
const purifiedData = '<a target="_blank" href="https://google.com">Link</a>';

describe('GetPurifiedContent', () => {
  test('Should sanitize the data when unpurified data provided', async () => {
    //Arrange & Assert
    expect(await getPurifiedContent(unPurifiedData)).toBe(purifiedData);
  });

  test('Should render empty string when null given as input', async () => {
    //Arrange
    const input = '';
    const output = '';

    //Assert
    expect(await getPurifiedContent(input)).toBe(output);
  });
});

//Arrange
const dataWithHtmlContent = '<p>Lead <strong>squared</strong></p>';
const parsedData = 'Lead squared';

describe('ExtractHTMLContent', () => {
  test('should extract text content when data containing html is provided', () => {
    //Arrange & Assert
    expect(extractHTMLContent(dataWithHtmlContent)).toBe(parsedData);
  });

  test('should render null when null given as input', () => {
    //Arrange

    const input = '';
    const output = '';

    //Assert
    expect(extractHTMLContent(input)).toBe(output);
  });
});
