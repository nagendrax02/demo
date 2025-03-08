import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EntityType } from 'common/types';
import ChangeStage from '../ChangeStage';
import * as restClient from 'common/utils/rest-client';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

//Arrange
const entityType = EntityType.Lead;
const stageValue = 'Opportunity';
const setMessage = jest.fn();
const setSelectedOption = jest.fn();
const message = '';
const selectedOption = [
  {
    label: 'Prospect',
    value: 'Prospect'
  }
];

const config = {
  Label: 'Change Comment'
};

jest.mock('src/common/utils/rest-client', () => ({
  Module: {
    Marvin: 'MARVIN'
  },
  httpPost: jest.fn(() => Promise.resolve({})),
  CallerSource: {}
}));

const mockedApiResult = {
  SchemaName: null,
  Options: [
    {
      value: 'Prospect',
      label: 'Prospect',
      text: null,
      category: null,
      isDefault: false
    },
    {
      value: 'Opportunity',
      label: 'Opportunity',
      text: null,
      category: null,
      isDefault: false
    }
  ],
  OptionSet: null
};

const entityIds = {
  Lead: '',
  Opportunity: '',
  Account: '',
  Activity: ''
};

const coreData = {
  entityDetailsType: EntityType.Lead,
  entityIds: entityIds as unknown as IEntityIds,
  entityRepNames: {}
};

describe('ChangeStage', () => {
  test('Should render ChangeStage and text area when default props passed', async () => {
    //Arrange
    render(
      <ChangeStage
        entityType={entityType}
        stageValue={stageValue}
        setMessage={setMessage}
        setSelectedOption={setSelectedOption}
        message={message}
        selectedOption={selectedOption}
        setShowError={jest.fn()}
        config={config}
        setCommentsOptions={jest.fn()}
        commentsOptions={selectedOption}
        showError={false}
        entityDetailsCoreData={coreData as IEntityDetailsCoreData}
      />
    );

    await waitFor(() => {
      //Assert
      expect(screen.getByPlaceholderText('Comments')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });
  });

  test('Should click on the option when dropdown is open', async () => {
    //Arrange
    render(
      <ChangeStage
        entityType={entityType}
        stageValue={stageValue}
        setMessage={setMessage}
        setSelectedOption={setSelectedOption}
        message={message}
        selectedOption={selectedOption}
        setShowError={jest.fn()}
        config={config}
        setCommentsOptions={jest.fn()}
        commentsOptions={selectedOption}
        showError={false}
        entityDetailsCoreData={coreData as IEntityDetailsCoreData}
      />
    );

    //Act
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    await waitFor(() => {
      //Assert
      expect(screen.getByText('Prospect')).toBeInTheDocument();
    });
  });
});
