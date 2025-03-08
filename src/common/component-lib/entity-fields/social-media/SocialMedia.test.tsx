import { render, fireEvent, screen } from '@testing-library/react';
import SocialMedia from './SocialMedia';

//Arrange
const link = 'https://www.google.com';

describe('SocialMedia', () => {
  test('Should render SocialMedia component when defaults props is passed', () => {
    //Arrange
    render(<SocialMedia link={link} />);

    //Assert
    expect(screen.getByTestId('social-media')).toBeInTheDocument();
  });

  test('Should render SocialMedia component when a link and default config is provided', () => {
    //Arrange
    render(<SocialMedia link={link} />);

    //Assert
    expect(screen.getByText('https://www.google.com')).toBeInTheDocument();
  });

  test('Should render SocialMedia component with custom icon when schemaName and link provided', () => {
    //Arrange
    render(
      <SocialMedia
        link={link}
        config={{ renderIcon: true, renderLink: false }}
        schemaName="facebookid"
      />
    );

    //Assert
    expect(screen.getByTestId('facebook')).toBeInTheDocument();
  });
});
