import { render, screen } from '@testing-library/react';
import Count from './Count';

describe('Entity Attribute Details Count', () => {
  test('Should render entity attributes count', () => {
    //Arrange
    render(<Count value={100} />);

    //Assert
    expect(screen.getByText('All (100)')).toBeInTheDocument();
  });
});
