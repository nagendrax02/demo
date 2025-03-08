import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LeadStarred from './LeadStarred';
import * as restClient from 'common/utils/rest-client';

//Arrange
jest.mock('common/utils/rest-client', () => ({
  Module: { LeadManagement: 'LeadManagement' },
  httpGet: jest.fn(),
  CallerSource: {}
}));

jest.mock('common/utils/rest-client', () => ({
  Module: { LeadManagement: 'LeadManagement' },
  httpGet: jest.fn(),
  CallerSource: {}
}));

jest.mock('common/utils/helpers', () => ({
  getEntityId: jest.fn(() => 'mockLeadId')
}));

const mockApiResult = {
  Status: 'Success'
};

describe('LeadStarred', () => {
  it('Should render the Lead starred icon when default props passed', () => {
    //Arrange
    render(<LeadStarred />);

    //Assert
    expect(screen.getByTestId('lead-starred')).toBeInTheDocument();
    expect(screen.getByTitle('Star Lead')).toBeInTheDocument();
  });

  it('Should toggle the icon when clicked', async () => {
    //Arrange
    jest.spyOn(restClient, 'httpGet').mockResolvedValueOnce(mockApiResult);
    render(<LeadStarred />);

    const divElement = screen.getByTestId('lead-starred-icon-container');

    //Assert
    expect(divElement).toBeInTheDocument();

    fireEvent.click(divElement);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('lead-starred-filled')).toBeInTheDocument();
    });
  });
});
