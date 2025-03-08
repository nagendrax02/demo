import { render, fireEvent } from '@testing-library/react';
import Body from '../tools/add-link/Body';
import { WEB_PROTOCOLS } from '../constants';

describe('Body', () => {
  const mockSetProtocol = jest.fn();
  const mockSetLink = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testProtocol = WEB_PROTOCOLS[0];

  it('Should render component', () => {
    // Act
    const { getByTestId } = render(
      <Body protocol={testProtocol} setProtocol={mockSetProtocol} link="" setLink={mockSetLink} />
    );

    // Assert
    expect(getByTestId('add-link-body')).toBeInTheDocument();
  });
});
