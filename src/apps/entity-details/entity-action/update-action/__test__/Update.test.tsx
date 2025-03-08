import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Update from '../Update';
import * as restClient from 'common/utils/rest-client';
import { API_ROUTES, MOCK_ENTITY_DETAILS_CORE_DATA } from 'src/common/constants';

//Arrange

jest.mock('src/common/utils/entity-data-manager/account/metadata', () => ({
  fetchAccountMetaData: () => Promise.resolve({})
}));

jest.mock('src/common/utils/entity-data-manager/lead/metadata', () => ({
  fetchLeadMetaData: () => Promise.resolve({})
}));

jest.mock('src/common/utils/rest-client', () => ({
  Module: {
    Marvin: 'MARVIN'
  },
  httpPost: jest.fn(() => Promise.resolve({})),
  CallerSource: {}
}));

jest.mock('../../../entitydetail.store', () => ({
  __esModule: true,
  default: jest.fn(),
  useLeadRepName: jest.fn()
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

const entityId = ['123'];
const handleClose = jest.fn();
const actionType = 'ChangeStage';

describe('Update', () => {
  it('Should render the Update component when default props are passed', async () => {
    render(
      <Update
        entityId={entityId}
        handleClose={handleClose}
        actionType={actionType}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    expect(screen.getByText('Change Stage')).toBeInTheDocument();
    expect(screen.getByText('Lead Field')).toBeInTheDocument();
    expect(screen.getByText('Update To')).toBeInTheDocument();
    expect(
      screen.getByText('Update Lead Field with new value for the selected Lead')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('Should close the modal when clicked on close button', async () => {
    render(
      <Update
        entityId={entityId}
        handleClose={handleClose}
        actionType={actionType}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    await waitFor(() => {
      const getButton = screen.getByText('Cancel');
      fireEvent.click(getButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('Should handle the save button when clicked on save button', async () => {
    render(
      <Update
        entityId={entityId}
        handleClose={handleClose}
        actionType={actionType}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    await waitFor(async () => {
      expect(screen.getByText('Select')).toBeInTheDocument();
      const getButton = screen.getByText('Save');
      fireEvent.click(getButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
