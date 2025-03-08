import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Actions from '../actions';
import { IActionMenuItem, IAugmentedAction } from 'src/apps/entity-details/types/entity-data.types';
import { ActionRenderType } from 'src/apps/entity-details/types';
import { ACTION } from 'src/apps/entity-details/constants';
import { PROCESS_BUTTON } from '../actions/constant';
import * as actionUtils from '../actions/utils/utils';
import {
  commonActionData,
  convertedButtonActionsTwoForms,
  convertedMoreAction,
  moreActions
} from '../__mocks__/data';
import ButtonActions from '../actions/button-actions';
import MoreActions from '../actions/more-actions';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

const mockHoverEvent = (testId) => {
  fireEvent.mouseEnter(screen.getByTestId(testId));
};

const ACTION_MOCK: IAugmentedAction = {
  actions: [
    {
      id: 'Edit',
      title: 'Edit',
      type: ActionRenderType.Button,
      sequence: 0,
      renderAsIcon: false,
      disabled: true,
      toolTip: 'action-toolTip',
      actionHandler: {}
    },
    {
      id: 'SendEmail',
      title: 'Email',
      type: ActionRenderType.Button,
      sequence: 13,
      renderAsIcon: false,
      subMenu: [
        {
          label: 'Send Email',
          value: 'SendEmail',
          disabled: true,
          toolTip: 'Lead opted out from email communication'
        },
        {
          label: 'View Scheduled Email',
          value: 'ViewScheduledEmail'
        }
      ] as IActionMenuItem[],
      actionHandler: {}
    },
    {
      id: 'Owner',
      title: 'Owner',
      type: ActionRenderType.Button,
      sequence: 2,
      renderAsIcon: false,
      toolTip: 'action-toolTip',
      actionHandler: {}
    },
    {
      id: 'Activity',
      title: 'Activity',
      type: ActionRenderType.Dropdown,
      sequence: 0,
      renderAsIcon: false,
      actionHandler: {}
    },
    {
      id: 'Call',
      title: 'Call',
      type: ActionRenderType.Dropdown,
      sequence: 3,
      renderAsIcon: false,
      actionHandler: {}
    }
  ],
  settingConfig: {
    ActivityProcessBtnConfig: '{"displayName":"Processes1","showAfterQuickAdd":true}',
    DisableQuickAddActivityBtn: '1'
  }
};

describe('Actions', () => {
  it('Should render shimmer when loading is true', () => {
    // Act
    const { getByTestId } = render(
      <Actions isLoading={true} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    expect(getByTestId('action-shimmer-wrapper')).toBeInTheDocument();
  });

  it('Should render action as button when render type is button', async () => {
    // Act
    const { queryByTestId } = render(
      <Actions isLoading={false} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('SendEmail')).toBeInTheDocument();
      expect(queryByTestId('Activity')).toBeNull();
      expect(queryByTestId('Call')).toBeNull();
    });
  });

  it('Should render more action button when action render type is dropdown', async () => {
    // Act
    const { queryByTestId } = render(
      <Actions isLoading={false} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('entity-more-actions')).toBeInTheDocument();
    });
  });

  it('Should not render more action button when no action with dropdown render type is present', async () => {
    //Arrange
    const updatedConfig = { ...ACTION_MOCK };
    updatedConfig.actions = updatedConfig?.actions?.filter?.(
      (action) => action?.type !== ActionRenderType.Dropdown
    );

    // Act
    const { queryByTestId } = render(
      <Actions isLoading={false} config={updatedConfig} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('entity-more-actions')).toBeNull();
    });
  });

  it('Should not render any action when no action is present', async () => {
    //Arrange
    const updatedConfig = { ...ACTION_MOCK };
    updatedConfig.actions = [];
    // Act
    const { getByTestId } = render(
      <Actions isLoading={false} config={updatedConfig} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(getByTestId('action-wrapper').children?.length).toBe(0);
    });
  });

  it('Should wrap the button with action menu when sub menu is present', async () => {
    // Act
    const { getByTestId } = render(
      <Actions isLoading={false} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(getByTestId('action-menu-SendEmail')).toBeInTheDocument();
    });
  });

  it('Should wrap the button with toolTip menu when toolTip is present', async () => {
    // Act
    const { getByTestId } = render(
      <Actions isLoading={false} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(getByTestId('action-toolTip-Owner')).toBeInTheDocument();
    });
  });

  it('Should not show process button when process is not present', async () => {
    // Act
    const { queryByTestId } = render(
      <Actions isLoading={false} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId(ACTION.Processes)).toBeNull();
    });
  });

  it('Should show process button when process is present', async () => {
    //Arrange
    const actionsWithProcess = ACTION_MOCK;
    actionsWithProcess.actions = [...actionsWithProcess.actions, PROCESS_BUTTON];
    // Act
    const { queryByTestId } = render(
      <Actions isLoading={false} config={ACTION_MOCK} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId(ACTION.Processes)).toBeInTheDocument();
    });
  });
});

describe('Process Button Actions', () => {
  it('Should show process forms on hover of button action if more than one form is present', async () => {
    // Arrange
    jest
      .spyOn(actionUtils, 'getConvertedButtonActions')
      .mockReturnValue(convertedButtonActionsTwoForms);
    const { queryByTestId } = render(
      <ButtonActions actions={[commonActionData]} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Act
    mockHoverEvent(commonActionData?.id);

    // Assert
    await waitFor(() =>
      expect(
        queryByTestId(`menu-item-${convertedButtonActionsTwoForms[0].subMenu?.[0].value}`)
      ).toBeInTheDocument()
    );
  });
});

describe('Process More Actions', () => {
  it('Should show process forms on hover of action if more than one form is present', async () => {
    // Arrange
    jest.spyOn(actionUtils, 'getConvertedMoreActions').mockReturnValue(convertedMoreAction);
    const { queryByTestId } = render(
      <MoreActions actions={moreActions} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />
    );

    // Act
    mockHoverEvent('entity-more-actions');

    // Assert
    await waitFor(() =>
      expect(
        queryByTestId(`menu-item-${convertedMoreAction[0].subMenu?.[0].value}`)
      ).toBeInTheDocument()
    );
  });
});
