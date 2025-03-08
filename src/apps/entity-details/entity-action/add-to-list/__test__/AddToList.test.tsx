import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AddToList from '../AddToList';
import * as restClient from 'common/utils/rest-client';

//Arrange
const handleClose = jest.fn();
const leadRepresentationName = {
  SingularName: 'lead',
  PluralName: 'lead'
};

const mockedApiResult = {
  Options: [
    {
      value: 'abc',
      label: 'abc'
    },
    {
      value: 'def',
      label: 'def'
    }
  ]
};

describe('AddToList', () => {
  it('Should render the AddToList when default props passed', async () => {
    render(<AddToList handleClose={handleClose} leadRepresentationName={leadRepresentationName} />);

    await waitFor(() => {
      expect(screen.getByText(/Select list where you want to add selected/i)).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
