import { processFormsData, recursiveProcessData } from '../__mocks__/data';
import * as processUtils from '../process';
import {
  fetchMultipleWorkAreaProcessForms,
  getProcessKey,
  getWorkAreaProcessForms,
  processFormsToSubMenu
} from '../process';
import { IProcessFormsData, IWorkAreaConfig } from '../process.types';
import * as restClient from '../../rest-client';

let processData: IProcessFormsData;
let workAreaConfig: IWorkAreaConfig;

// Mock httpPost
jest.mock('../../rest-client');

describe('Process Utils', () => {
  beforeEach(() => {
    // Arrange
    processData = processFormsData as unknown as IProcessFormsData;
    workAreaConfig = { workAreaId: 27 };
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('Should add subMenu to the given action and sort it in ascending order', () => {
    // Act
    const subMenu = processFormsToSubMenu({
      workAreaConfig,
      processFormsData: processData
    });

    // Assert
    expect(subMenu).toEqual([
      {
        label: 'A',
        value: 'a6924260-f208-4e91-bcb5-4b490b51d619',
        workAreaConfig: {
          workAreaId: 27
        }
      },
      {
        label: 'B',
        value: 'e0271499-4699-11ee-886c-02eefa84bd20',
        workAreaConfig: {
          workAreaId: 27
        }
      }
    ]);
  });

  it('Should get process of particular workArea', () => {
    // Act
    const key = getProcessKey(workAreaConfig);
    const processDataOfWorkArea = getWorkAreaProcessForms(processData, key);

    // Assert
    expect(processDataOfWorkArea).toEqual(processData?.[workAreaConfig.workAreaId]);
  });

  it('Should fetch processForms recursively until LastEvaluatedProcess === -1', async () => {
    // Arrange
    jest
      .spyOn(restClient, 'httpPost')
      .mockResolvedValueOnce([
        {
          Event: {
            WorkAreaId: workAreaConfig.workAreaId,
            LastEvaluatedProcess: 3032
          }
        }
      ])
      .mockResolvedValueOnce([
        {
          Event: {
            WorkAreaId: workAreaConfig.workAreaId,
            LastEvaluatedProcess: -1
          }
        }
      ]);

    // Act
    const result = await fetchMultipleWorkAreaProcessForms(
      [workAreaConfig],
      restClient.CallerSource.NA
    );

    // Assert
    expect(result).toEqual(recursiveProcessData);
  });

  it('Should filter cached workAreas before making api call', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce([
      {
        Event: {
          WorkAreaId: 28,
          LastEvaluatedProcess: -1
        }
      }
    ]);
    jest.spyOn(processUtils, 'getCachedProcessForms').mockReturnValue(processData);
    const fetchSpy = jest.spyOn(processUtils, 'fetchRecursiveProcessForms');

    // Act
    await processUtils.fetchMultipleWorkAreaProcessForms(
      [{ workAreaId: 27 }, { workAreaId: 28 }],
      restClient.CallerSource.NA
    );

    // Assert
    expect(fetchSpy).toHaveBeenCalledWith([{ workAreaId: 28 }], 'NA');
  });
});
