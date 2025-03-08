import { recursiveProcessData } from 'common/utils/process/__mocks__/data';
import {
  commonActionData,
  convertedQuickAction,
  moreActions,
  processFormsData,
  processFormsDataForActivity,
  processFormsDataForSingleForm,
  quickAction,
  subMenu
} from '../__mocks__/data';
import { getConvertedButtonActions, getConvertedMoreActions } from '../actions/utils/utils';
import * as processUtils from 'common/utils/process/process';
import { PROCESS_BUTTON } from '../actions/constant';
import { IProcessActionOutput, IProcessFormsData } from 'common/utils/process/process.types';
import { getConvertedQuickActions } from '../quick-action/utils';
import { ACTION } from 'apps/entity-details/constants';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('getConvertedButtonActions', () => {
  it('Should return original actions when processFormsData is null', async () => {
    // Arrange
    const actions = [commonActionData];
    jest
      .spyOn(processUtils, 'fetchMultipleWorkAreaProcessForms')
      .mockResolvedValue(recursiveProcessData);

    // Act
    const result = getConvertedButtonActions(actions, null, false);

    // Assert
    expect(result).toEqual(actions);
  });

  it('Should remove process button when no forms are configured', async () => {
    // Arrange
    const actions = [PROCESS_BUTTON];
    jest
      .spyOn(processUtils, 'fetchMultipleWorkAreaProcessForms')
      .mockResolvedValue(processFormsDataForActivity);

    // Act
    const result = getConvertedButtonActions(actions, processFormsDataForActivity, false);

    // Assert
    expect(result).toEqual([]);
  });

  it('Should return converted actions with process name as title for single form', async () => {
    // Arrange
    const actions = [PROCESS_BUTTON];
    jest
      .spyOn(processUtils, 'fetchMultipleWorkAreaProcessForms')
      .mockResolvedValue(processFormsDataForSingleForm as IProcessFormsData);

    // Act
    const result = getConvertedButtonActions(
      actions,
      processFormsDataForSingleForm as IProcessFormsData,
      false
    )?.[0];
    const processDataOfWorkArea = processFormsDataForSingleForm[
      PROCESS_BUTTON.workAreaConfig.workAreaId
    ].ActionOutputs[0] as IProcessActionOutput;

    // Assert
    expect(result).toHaveProperty(
      'title',
      processDataOfWorkArea?.Entity?.DisplayProperty?.DisplayName
    );
  });
});

describe('getConvertedMoreActions', () => {
  it('Should return converted actions with process name as title for single form', async () => {
    // Arrange
    const actions = moreActions;
    const workAreaId = moreActions[0].workAreaConfig?.workAreaId || 0;

    jest
      .spyOn(processUtils, 'fetchMultipleWorkAreaProcessForms')
      .mockResolvedValue(processFormsDataForSingleForm as IProcessFormsData);

    // Act
    const result = getConvertedMoreActions(
      actions,
      processFormsDataForSingleForm as IProcessFormsData,
      false
    )?.[0];

    const processDataOfWorkArea = processFormsDataForSingleForm[workAreaId]
      .ActionOutputs[0] as IProcessActionOutput;

    // Assert
    expect(result).toHaveProperty(
      'title',
      processDataOfWorkArea?.Entity?.DisplayProperty?.DisplayName
    );

    // Ensure process button is removed when no forms are available
    const actionsWithoutForms = getConvertedMoreActions(actions, {} as IProcessFormsData, false);
    expect(actionsWithoutForms.some((action) => action.id === ACTION.Processes)).toBe(false);
  });
});
