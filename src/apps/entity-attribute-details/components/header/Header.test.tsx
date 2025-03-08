import { render, screen } from '@testing-library/react';
import Header from './Header';
import { TAB_ID } from 'src/common/component-lib/entity-tabs/constants/tab-id';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

describe('Entity Attribute Details Header', () => {
  test('Should render entity attribute details header', () => {
    //Arrange
    render(
      <Header
        tabId={TAB_ID.LeadAttributeDetails}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Assert
    expect(screen.getByTestId('ead-header')).toBeInTheDocument();
  });
});
