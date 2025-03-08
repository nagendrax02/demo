import { render, waitFor } from '@testing-library/react';
import Cc from '../components/fields/Cc';
import { CallerSource } from 'src/common/utils/rest-client';

describe('Cc component', () => {
  it('Should render component when mounted', async () => {
    const { getByTestId } = render(<Cc callerSource={CallerSource.NA} />);
    await waitFor(() => {
      expect(getByTestId('cc-field')).toBeInTheDocument();
    });
  });
});
