import { IButtonAction } from 'src/apps/entity-details/types/entity-data.types';
import { handleActionSegregation } from '../action-utils/action';
import { getActions } from '../vcard-action';
import {
  MOCK_ENTITY_DATA,
  actionsAugmentationMock,
  settingConfigurationMock
} from './mock-configs';
import { ACTION } from 'src/apps/entity-details/constants';

describe('getActions', () => {
  it('Should return augmented actions config when raw data is provided', () => {
    // Act
    const result = getActions(MOCK_ENTITY_DATA);

    // Assert
    expect(result)?.toBeInstanceOf(Object);
    expect(result.actions).toEqual(actionsAugmentationMock);
    expect(result.settingConfig).toEqual(settingConfigurationMock);
  });

  it('Should include the process action config as part of augmentation.', () => {
    // Act
    const result = getActions(MOCK_ENTITY_DATA);

    // Assert
    const processAction = result?.actions?.find((action) => action?.id === ACTION.Processes);
    expect(processAction?.id).toBe(ACTION.Processes);
  });
});

describe('handleActionSegregation', () => {
  it('Should return button actions and more actions array when actions are provided', () => {
    // Act
    const result = handleActionSegregation(actionsAugmentationMock as IButtonAction[]);

    // Assert
    expect(result)?.toBeInstanceOf(Object);
    expect(result.buttonActions.length).toBe(3);
    expect(result.moreActions.length).toBe(2);
    expect(result.moreActions[1].subMenu?.length).toBe(2);
  });

  it('"Should include the loading key when loading action list is provided"', () => {
    // Act
    const result = handleActionSegregation(actionsAugmentationMock as IButtonAction[], [
      ACTION.Call
    ]);

    // Assert
    const callActions = result?.buttonActions?.find((action) => action?.id === ACTION.Call);
    expect(callActions?.isLoading)?.toBe(true);
  });
});
