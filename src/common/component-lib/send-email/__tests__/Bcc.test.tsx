import { render, waitFor } from '@testing-library/react';
import Bcc from '../components/fields/Bcc';
import { CallerSource } from 'src/common/utils/rest-client';

describe('Cc component', () => {
  it('Should render component when mounted', async () => {
    const { getByTestId } = render(<Bcc callerSource={CallerSource.NA} />);
    await waitFor(() => {
      expect(getByTestId('bcc-field')).toBeInTheDocument();
    });
  });
});
