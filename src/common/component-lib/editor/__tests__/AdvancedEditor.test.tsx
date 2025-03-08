import { render } from '@testing-library/react';
import AdvancedEditor from '../advanced-editor';
import { CallerSource } from 'src/common/utils/rest-client';

describe('AdvancedEditor', () => {
  it('Should render editor', () => {
    // Act
    const { getByTestId } = render(
      <AdvancedEditor value="" onValueChange={() => {}} callerSource={CallerSource.NA} />
    );

    // Assert
    expect(getByTestId('marvin-froala-advanced-editor')).toBeInTheDocument();
  });
});
