import { EntityType } from 'common/types';
import Body from '../Body';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
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
  required: true,
  compRender,
  getBodyTitle,
  showError: false,
  entityDetailsCoreData: coreData as IEntityDetailsCoreData,
  sendCalenderInvite: false,
  setSendCalenderInvite: () => {}
};

describe('Body', () => {
  it('Should render the body when default props is passed', async () => {
    //Arrange
    render(<Body {...defaultProps} />);

    //Assert
    expect(screen.getByText(getBodyTitle[actionType])).toBeInTheDocument();
    expect(screen.getByText(`${leadRepresentationName.SingularName} Field`)).toBeInTheDocument();
    expect(screen.getByText('Update To')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
