import { render } from '@testing-library/react';
import Tabs from '../Tabs';

describe('Tabs', () => {
  test('Should render tabs', () => {
    //Arrange
    const { getByTestId, getByText } = render(
      <Tabs>
        <>
          <div>Tab 1</div>
          <div>Tab 2</div>
          <div>Tab 3</div>
        </>
      </Tabs>
    );

    //Assert
    expect(getByTestId('tabs')).toBeInTheDocument();
    expect(getByText('Tab 1')).toBeInTheDocument();
  });
});
