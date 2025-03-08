import { render } from '@testing-library/react';
import BasicEditor from '../basic-editor';

describe('BasicEditor', () => {
  it('Should render editor', () => {
    // Act
    const { getByTestId } = render(<BasicEditor value="" onValueChange={() => {}} />);

    // Assert
    expect(getByTestId('marvin-froala-basic-editor')).toBeInTheDocument();
  });
});
