import { render, fireEvent, screen, waitFor, queryByTestId } from '@testing-library/react';
import { actions, mailMergedRes } from './mocks';
import * as restClient from 'common/utils/rest-client';
import CustomActions from '../CustomActions';
import { headers } from '../utils';
import { HttpMethod } from 'common/utils/rest-client';

jest.mock('common/utils/rest-client', () => ({
  httpGet: jest.fn(),
  httpPost: jest.fn(),
  httpRequest: jest.fn(),
  Module: {
    Marvin: 'MARVIN'
  },
  HttpMethod: {
    Post: 'POST',
    Get: 'GET'
  },
  CallerSource: {}
}));

window.open = jest.fn();

const toggleShow = jest.fn();
const renderCustomAction = (config) => (
  <CustomActions
    entityRecords={[]}
    toggleShow={toggleShow}
    connectorConfig={config}
    callerSource={restClient.CallerSource.NA}
  />
);

describe('CustomActions', () => {
  it('Should open link in new window when action type is OpenNewWindow.', async () => {
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mailMergedRes[0]);
    render(renderCustomAction(actions[0]));

    await waitFor(() => expect(window.open).toHaveBeenCalledWith('https://reqres.in/', '_blank'));
    await waitFor(() => expect(toggleShow).toHaveBeenCalled());
  });

  it('Should make POST api call when action type is CallAPI and method is POST.', async () => {
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mailMergedRes[1]);
    render(renderCustomAction(actions[1]));

    jest.spyOn(restClient, 'httpRequest').mockResolvedValueOnce('success');

    await waitFor(() => {
      expect(restClient.httpRequest).toHaveBeenCalledWith({
        url: 'https://pop123.free.beeceptor.com?org=9695',
        method: 'POST',
        body: { data: 1 },
        requestConfig: { headers },
        callerSource: undefined
      });
    });
  });

  it('Should make GET api call when action type is CallAPI and method is GET.', async () => {
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mailMergedRes[2]);
    render(renderCustomAction(actions[2]));
    jest.spyOn(restClient, 'httpRequest').mockResolvedValueOnce({ status: 'success' });

    await waitFor(() => {
      expect(restClient.httpRequest).toHaveBeenCalledWith({
        url: 'https://pop123.free.beeceptor.com?org=9695',
        method: 'GET',
        requestConfig: { headers },
        callerSource: undefined
      });
    });
  });

  it('Should open action in popup when action type is ShowPopup and method is GET.', async () => {
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mailMergedRes[3]);
    const { queryByTestId } = render(renderCustomAction(actions[3]));

    await waitFor(() => {
      expect(queryByTestId('iframe')).toBeInTheDocument();
      const iframe = screen.getByTestId('iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://help.leadsquared.com');
    });
  });

  it('Should open action in popup when action type is ShowPopup and method is POST.', async () => {
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mailMergedRes[4]);
    const { queryByTestId } = render(renderCustomAction(actions[4]));
    jest.spyOn(restClient, 'httpRequest').mockResolvedValue('Iframe Doc Content');

    await waitFor(() => {
      expect(queryByTestId('iframe')).toBeInTheDocument();
      const iframe = screen.getByTestId('iframe') as HTMLIFrameElement;
      expect(iframe.srcdoc).toContain('Iframe Doc Content');
    });
  });

  it('Should close popup when api fails.', async () => {
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mailMergedRes[4]);
    const { queryByText } = render(renderCustomAction(actions[4]));
    jest.spyOn(restClient, 'httpRequest').mockResolvedValue('');

    await waitFor(() => {
      expect(queryByText('Show as Popup - Post')).toBeInTheDocument();
      expect(restClient.httpRequest).toHaveBeenCalledWith({
        url: 'https://showpop.free.beeceptor.com',
        method: 'POST',
        body: { data: 1 },
        requestConfig: { headers },
        callerSource: undefined
      });
    });
    await waitFor(() => expect(queryByText('Show as Popup - Post')).not.toBeInTheDocument());
  });
});
