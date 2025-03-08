import { render, screen, waitFor } from '@testing-library/react';
import EntityDetails from './EntityDetails';
import useEntityStore from './entitydetail.store';
import { EntityType } from 'common/types';

describe('EntityDetails', () => {
  it('Should render entityDetails layout', async () => {
    // Arrange
    const { getByTestId } = render(<EntityDetails type={EntityType?.Lead} />);

    // Assert
    const entityDetailsPage = await screen.findByTestId('entitydetails-page');

    await waitFor(() => {
      expect(getByTestId('entitydetails-page')).toBeInTheDocument();
    });
  });
});

export default useEntityStore;
