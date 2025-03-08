import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RenderUpdate from '../RenderUpdate';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { EntityType } from 'common/types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

jest.mock('src/common/utils/entity-data-manager/account/metadata', () => ({
  fetchAccountMetaData: jest.fn(() => Promise.resolve({}))
}));

jest.mock('src/common/utils/entity-data-manager/lead/metadata', () => ({
  fetchLeadMetaData: jest.fn(() => Promise.resolve({}))
}));

//Arrange
const leadRepresentationName = {
  SingularName: 'lead',
  PluralName: 'leads'
};
const actionType = 'ChangeStage';

const compRender = {
  [actionType]: <div>hello world</div>
};

const getBodyTitle = {
  [actionType]: 'hello to the world of Cleoneshi testing'
};

const handleClose = jest.fn();
const handleApiCall = jest.fn();

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

const defaultProps = {
  leadRepresentationName,
  actionType,
  compRender,
  getBodyTitle,
  required: true,
  handleClose,
  handleApiCall,
  isLoading: false,
  disabledSave: false,
  showError: false,
  entityDetailsCoreData: coreData as IEntityDetailsCoreData,
  sendCalenderInvite: false,
  setSendCalenderInvite: () => {}
};

describe('Body', () => {
  it('Should render the body when default props is passed', async () => {
    //Arrange
    render(<RenderUpdate {...defaultProps} />);

    //Assert
    expect(screen.getByText(getBodyTitle[actionType])).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('Should handle the close button when clicked on close button', async () => {
    //Arrange
    render(<RenderUpdate {...defaultProps} />);

    //Assert
    expect(screen.getByText(getBodyTitle[actionType])).toBeInTheDocument();
    await waitFor(() => {
      const button = screen.getByText('Cancel');
      fireEvent.click(button);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('Should handle the Save button when clicked on save button', async () => {
    //Arrange
    render(<RenderUpdate {...defaultProps} />);

    //Assert
    expect(screen.getByText(getBodyTitle[actionType])).toBeInTheDocument();
    await waitFor(() => {
      const button = screen.getByText('Save');
      fireEvent.click(button);
      expect(handleApiCall).toHaveBeenCalledTimes(1);
    });
  });
});
