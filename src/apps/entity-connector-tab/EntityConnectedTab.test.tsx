import { render, waitFor } from '@testing-library/react';
import ConnectorTab from './EntityConnectorTab';
import { httpPost } from 'src/common/utils/rest-client';

const tab = {
  id: 'tabId',
  name: 'tabName',
  isDefault: false,
  type: 1,
  url: 'tabUrl'
};

jest.mock('common/utils/rest-client', () => ({
  httpPost: jest.fn().mockReturnValue('https://mailMergedContent'),
  Module: { Connector: 'Connector' },
  CallerSource: {}
}));

describe('Connecter Tab', () => {
  it('Should display connecter tab when invoked', () => {
    //Arrange
    const { getByTestId } = render(<ConnectorTab tab={tab} />);

    //Assert
    expect(getByTestId('entity-connector-tab')).toBeInTheDocument();
  });

  it('Should display shimmer when fetching mail merged url', () => {
    //Arrange
    const { getByTestId } = render(<ConnectorTab tab={tab} />);

    //Assert

    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('Should display the iframe with mailMerged url', async () => {
    //Arrange
    const { getByTestId } = render(<ConnectorTab tab={tab} />);

    //Assert
    await waitFor(() => {
      expect(getByTestId('iframe')).toBeInTheDocument();
      expect(getByTestId('iframe')?.getAttribute('src')).toContain('https://mailmergedcontent');
    });
  });

  it('Should not display spinner when failed to get mail merged content', async () => {
    //Arrange
    (httpPost as jest.Mock).mockImplementation(() => {
      throw new Error('sdf');
    });
    const { queryByTestId } = render(<ConnectorTab tab={tab} />);

    //Assert
    await waitFor(() => {
      expect(queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});
