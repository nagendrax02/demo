import { render, screen, waitFor } from '@testing-library/react';
import EntityAttributeDetails from './EntityAttributeDetails';
import { TAB_ID } from 'src/common/component-lib/entity-tabs/constants/tab-id';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from '../../common/constants';

describe('Entity Attribute Details', () => {
  test('Should render entity attribute details', async () => {
    //Arrange
    render(
      <EntityAttributeDetails
        tabId={TAB_ID.LeadAttributeDetails}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('entity-attribute-details')).toBeInTheDocument();
    });
  });
});
