import { fireEvent, queryByTestId, waitFor, screen, render } from '@testing-library/react';
import Edit from './Edit';
import { TAB_ID } from 'src/common/component-lib/entity-tabs/constants/tab-id';
import * as editUtils from '../utils/edit';
import * as entityDetailsStore from 'apps/entity-details/entitydetail.store';
import * as processUtils from 'common/utils/process/process';
import { entityAttributeEditAction } from '../../constants';
import { ACTION } from 'apps/entity-details/constants';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

const mockHoverEvent = (testId) => {
  fireEvent.mouseEnter(screen.getByTestId(testId));
};

const subMenu = [
  {
    label: '0e9wew',
    value: '7bed4609-666c-11ee-ab2c-02eefa84bd20'
  },
  {
    label: '2878 SF',
    value: '8523395a-2f5c-473b-88e0-a9ea33306692'
  }
];

const action = entityAttributeEditAction[TAB_ID.LeadAttributeDetails];
const convertedAction = {
  ...action,
  subMenu: subMenu.slice(0, 1)
};

describe('Entity Attribute Details Edit Action', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('Should show process forms on hover if more than one form is configured', async () => {
    // Arrange
    jest.spyOn(entityDetailsStore, 'default').mockReturnValue({
      CanUpdate: 'true'
    });
    jest.spyOn(editUtils, 'getConvertedEditButton').mockReturnValue({
      ...action,
      subMenu: subMenu
    });
    const { queryByTestId } = render(
      <Edit
        tabId={TAB_ID.LeadAttributeDetails}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Act
    await waitFor(() => mockHoverEvent(`action-menu-${action.id}`));

    // Assert
    await waitFor(() => expect(queryByTestId(`menu-item-${subMenu[0].value}`)).toBeInTheDocument());
  });

  it('Should change button text to process name when only one process is present', async () => {
    // Arrange
    jest.spyOn(entityDetailsStore, 'default').mockReturnValue({
      CanUpdate: 'true'
    });
    jest.spyOn(processUtils, 'getProcessActionConfig').mockReturnValue({
      convertedAction,
      firstFormName: convertedAction.subMenu[0].label,
      totalForms: 1
    });

    // Act
    const { queryByTestId } = render(
      <Edit
        tabId={TAB_ID.LeadAttributeDetails}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    await waitFor(
      () => {
        expect(
          queryByTestId(`menu-item-${convertedAction.subMenu[0].value}`)
        ).not.toBeInTheDocument();
        expect(queryByTestId(`edit-btn-${ACTION.LeadAttributeDetailsEdit}`)?.textContent).toBe(
          convertedAction.subMenu[0].label
        );
      },
      { interval: 1000 }
    );
  });
});
