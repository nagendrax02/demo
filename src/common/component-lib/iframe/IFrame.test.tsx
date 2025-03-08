import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import IFrame from './IFrame';
import styles from './iframe.module.css';
import { getSrc } from './utils';

jest.mock('common/utils/authentication', () => ({
  getPersistedAuthConfig: jest.fn().mockReturnValue({ Tokens: { Token: 'token' } })
}));

describe('IFrame', () => {
  it('Should show spinner when showSpinner is true', () => {
    //Arrange
    const { getByTestId } = render(<IFrame id="iframe" src="" showSpinner />);

    //Assert
    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('Should attach attribute to iframe when provided', async () => {
    //Arrange
    const { getByTestId } = render(
      <IFrame id="iframe" src="https://www.google.com/" attributes={{ loading: 'eager' }} />
    );

    //Assert
    await waitFor(() => {
      expect(getByTestId('iframe').getAttribute('loading')).toBe('eager');
    });
  });

  it('Should append sanitized url when url is not valid', async () => {
    //Arrange
    const { getByTestId } = render(<IFrame id="iframe" src="www.google.com/" />);

    //Act
    const appendedSrc = getByTestId('iframe').getAttribute('src') || '';
    const url = new URL(appendedSrc);

    //Assert

    expect(getByTestId('iframe').getAttribute('src')).toContain('https://www.google.com/');
    expect(url.origin).toBe('https://www.google.com');
  });

  it('Should append lsqMarvinToken and isMarvin to src when url is provided', async () => {
    //Arrange
    const { getByTestId } = render(<IFrame id="iframe" src="www.google.com/" />);

    //Act
    const appendedSrc = new URL(getByTestId('iframe').getAttribute('src') || '');
    const searchParams = new URLSearchParams(appendedSrc.search);

    //Assert
    expect(searchParams.get('isMarvin')).toBe('1');
    expect(searchParams.get('lsqMarvinToken')).toBe('token');
  });

  it('Should not display shimmer and display iframe when iframe is loaded', async () => {
    //Arrange
    const { getByTestId, queryByTestId } = render(<IFrame id="iframe" src="www.google.com/" />);

    //Act
    fireEvent.load(getByTestId('iframe'));

    // Assert
    expect(queryByTestId('spinner')).not.toBeInTheDocument();
    expect(getByTestId('iframe')).not.toHaveClass(styles?.hide);
  });

  it('Should not display iframe when src is not provided', () => {
    //Arrange
    const { queryByTestId } = render(<IFrame id="iframe" src="" />);

    // Assert
    expect(queryByTestId('iframe')).not.toBeInTheDocument();
  });
});

describe('getSrc', () => {
  it('Should return empty string when invalid url is provided', () => {
    //Act
    const src = getSrc('');

    //Assert
    expect(src).toBe('');
  });
});
