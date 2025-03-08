import Forms from '../index';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import * as storageHelpers from 'common/utils/storage-manager';
import * as helperData from 'common/utils/helpers/helpers';
import generateAuthStorageData from '../form-data-transfer-helper';
import generateCallbackMapFromFormsData from '../callback-handler';

jest.mock('common/utils/authentication', () => ({
  getPersistedAuthConfig: jest.fn().mockReturnValue({ Tokens: { Token: 'token' } })
}));

jest.mock('common/utils/storage-manager', () => ({
  ...jest.requireActual('common/utils/storage-manager'),
  getItem: jest.fn().mockImplementation((key: string) => {
    if (key === storageHelpers.StorageKey.EnableFormsCloneUrl) {
      return 1;
    }
    if (key === storageHelpers.StorageKey?.Auth) {
      return {
        Tokens: {
          Token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDbGFpbXNEYXRhIjoiSCtFSEMxVTVPeUNjbDlDRUZLTFJ2T1d0RWUwc2l6VmNVSFl1bzJWdVNjcUlHdEZ5MzVhNVQ4Z0xJR0NYOGNkV3Uvenk0eFNhOEVrODlRRDdkZVF2cWoyWkdrMG5lMGprUldnWFEvYk9kQUwrdkc3eDltdW5PVWY2emJJdXRzOEVMYzloeWNPejlnYXBUTTVzbmE2UlFSTVBYQnhnNVJ6MlhFY1ZUV29UbzAzcHZUeWJDemIvdHU5NEpKSG82T0VZT1dJdmV3OFQyOXoxdXJFc0tqYkM4dUJ5REcxTVNVbU5LeWpsM1lySUtLWS8zc0R2SnlMczVwZFlJUDNpOUhJbXBPdHVnYlFmMDY2cWtrMVlzakpmWUxabFhsV214UTQzNDZ3TmEwV21pcDU0VWxjb1N2aWpnMHVBUkphUkNpem5CM04va3B4L25BR21sYlFac1BmNk4rYzVta0pSTk1PWUJZd3FmT3VTYzNDM3BYMmxMRFFmM05WMGprZS9PRkVPaFRWeFVua1pWei9yNXRhakdkaXdOUjR2eHFtcWJvV2pWUGc0TTdyNFFGVXNVSkV2OE85M2tCQVdOOFNNY0xUYkczU2VLZVBJTkFEenZRRnhHZWRUTTlTSE9ndFN2RFlkWFhCa0lLL3BHMkYxeEhlTStkbmlOK2Q0ZXhHZDM2MlJhTTlLd0c3WGcvWGpQZXZKenZVSDZnMTdSN3hGQk1KMEhlSU1ZWm85MlBmUk5WeHM2WWFBWlljYWJheW9RWGI1SklYMGlrdEgrZ3FxZkpUVzFCSXUzc3QwSmkvUFlRU0pIUHVKVTlEaXhIZUVwZDlHQ25NY1RwVXR2VlQ5YmNyYWVMNFZrRmJyRDAxL3ArcTRYaTF2QllvREdIOHI3Nk9LRm1hV1FmZEUyNnpqekMzL0s2TGhnQ0xXNW9wb3J6dzN1REdyaUZORWRaMWUvQ2hGbEp2K1JQWUxQYUVhSUU2Q2lrOCtuQ2J6cWZEMFN1cTRQV0FNUXJkTmtxQm00NGs1cjQ5NjJqUzhvOUFSQXorRVgzNDdEUzdTNXpMTWtnbi84VmVTUDVJVVA3Z2xkKzlGeUdvT2dtWGZxU2NPMlhlS01kSUtiR3lDN2xhd24xUGN1ZWY2VE1wZmxhdEV0SUVEMVIrTUhyTXN6d3JHUkZxV2ZmSHVzMEdHUVhEYVMwYWVBdDlrRGZVTmtOY2NuZCtOUXJ5bmFSSUJqMm1IOVQyUmo3aHJOSWFaRGJ0T1RQTmtvUlNla0EraG5ZampSeWdxWXdxN0VndFlmMHgvZHpnYlZ0bndTY3ZhS1A2RlJTazVmUENqcTB5dVhvcGFCQXVMNkFta3NweVVmMDVvWmpQWUl6UUdQZVNwRm9KNjJpT3lwT3VoZXc9PSIsIm5iZiI6MTcwMzY3ODg5OCwiZXhwIjoxNzAzNjgwMTI4LCJpYXQiOjE3MDM2Nzg5MjgsImlzcyI6IkxlYWRTcXVhcmVkIiwiYXVkIjoiY3JtNGIyYy5jb20ifQ.RAA-Icb1yl49axExn0clOn7atKXs6vrOZrNK9IZ6iZc',
          RefreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDbGFpbXNEYXRhIjoiSCtFSEMxVTVPeUNjbDlDRUZLTFJ2T1d0RWUwc2l6VmNVSFl1bzJWdVNjcUlHdEZ5MzVhNVQ4Z0xJR0NYOGNkV3Uvenk0eFNhOEVrODlRRDdkZVF2cWoyWkdrMG5lMGprUldnWFEvYk9kQUwrdkc3eDltdW5PVWY2emJJdXRzOEVMYzloeWNPejlnYXBUTTVzbmE2UlFSTVBYQnhnNVJ6MlhFY1ZUV29UbzAzcHZUeWJDemIvdHU5NEpKSG82T0VZT1dJdmV3OFQyOXoxdXJFc0tqYkM4dUJ5REcxTVNVbU5LeWpsM1lySUtLWS8zc0R2SnlMczVwZFlJUDNpOUhJbXBPdHVnYlFmMDY2cWtrMVlzakpmWUxabFhsV214UTQzNDZ3TmEwV21pcDU0VWxjb1N2aWpnMHVBUkphUkNpem5CM04va3B4L25BR21sYlFac1BmNk4rYzVta0pSTk1PWUJZd3FmT3VTYzNDM3BYMmxMRFFmM05WMGprZS9PRkVPaFRWeFVua1pWei9yNXRhakdkaXdOUjR2eHFtcWJvV2pWUGc0TTdyNFFGVXNVSkV2OE85M2tCQVdOOFNNY0xUYkczU2VLZVBJTkFEenZRRnhHZWRUTTlTSE9ndFN2RFlkWFhCa0lLL3BHMkYxeEhlTStkbmlOK2Q0ZXhHZDM2MlJhTTlLd0c3WGcvWGpQZXZKenZVSDZnMTdSN3hGQk1KMEhlSU1ZWm85MlBmUk5WeHM2WWFBWlljYWJheW9RWGI1SklYMGlrdEgrZ3FxZkpUVzFCSXUzc3QwSmkvUFlRU0pIUHVKVTlEaXhIZUVwZDlHQ25NY1RwVXR2VlQ5YmNyYWVMNFZrRmJyRDAxL3ArcTRYaTF2QllvREdIOHI3Nk9LRm1hV1FmZEUyNnpqekMzL0s2TGhnQ0xXNW9wb3J6dzN1REdyaUZORWRaMWUvQ2hGbEp2K1JQWUxQYUVhSUU2Q2lrOCtuQ2J6cWZEMFN1cTRQV0FNUXJkTmtxQm00NGs1cjQ5NjJqUzhvOUFSQXorRVgzNDdEUzdTNXpMTWtnbi84VmVTUDVJVVA3Z2xkKzlGeUdvT2dtWGZxU2NPMlhlS01kSUtiR3lDN2xhd24xUGN1ZWY2VE1wZmxhdEV0SUVEMVIrTUhyTXN6d3JHUkZxV2ZmSHVzMEdHUVhEYVMwYWVBdDlrRGZVTmtOY2NuZCtOUXJ5bmFSSUJqMm1IOVQyUmo3aHJOSWFaRGJ0T1RQTmtvUlNla0EraG5ZampSeWdxWXdxN0VndFlmMHgvZHpnYlZ0bndTY3ZhS1A2RlJTazVmUENqcTB5dVhvcGFCQXVMNkFta3NweVVmMDVvWmpQWUl6UUdQZVNwRm9KNjJpT3lwT3VoZXc9PSIsIm5iZiI6MTcwMzY3ODg5OCwiZXhwIjoxNzAzNzQzNzI4LCJpYXQiOjE3MDM2Nzg5MjgsImlzcyI6IkxlYWRTcXVhcmVkIiwiYXVkIjoiY3JtNGIyYy5jb20ifQ.hOKxTc3ZyAzj8GOSBbiQBX4kBSuC0Uk5nOywU5ouGu4',
          PermissionsToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDbGFpbXNEYXRhIjoiSCtFSEMxVTVPeUNjbDlDRUZLTFJ2T1d0RWUwc2l6VmNVSFl1bzJWdVNjcUlHdEZ5MzVhNVQ4Z0xJR0NYOGNkV3Uvenk0eFNhOEVrODlRRDdkZVF2cWoyWkdrMG5lMGprUldnWFEvYk9kQUwrdkc3eDltdW5PVWY2emJJdXRzOEVEYWZhdFMySFNoSURrWk5HcWJQQ2ZLWm92NlZSQWpNcjkyMkN1SzVJSEVnaVVmU3BnQWFlNG4raFFoaVc0d2R6c0pwR2crb3VjS2F1MVc1MnI3Qytzcy82SFM3bHBqV2FlT0FxcTVFQ1RNaGIwRXZpUDQ0a2tJYXZuVWxHL3FuekpBRy94MGU4YWZ1dC9VZjNzKzN4L2o1REM0Y2kwSTZpaUZzdktNKzlKdytOY0VBWXh0NTMyUzUycFo0a3B5eEhOYkNDK3NwMVgwcW5yNTA5SVl5QUpXK3NBcEFCQW0rTWRSdk10czU0ZzhINytmbHJleGtxbWNWWGNBTVp2eWNrWStkQ3FXTUlpUGJjTjlGL3F1TzRQM1ZicTh2RDFpSVMzM2psQXF6UVhrNWxvOVVNa3pQdXh5cmlrSVRHendKeUJJNzNtbno5QjZJMktxMnJDMVlpaUVMYkxwdW9sWFhkZGd4Z0hSbm9oamJEM28rL1E1UGpMcGVZeVltVUFtRWs4Ukk2MEs2a211K0VKOEpZVHFldGt3PT0iLCJuYmYiOjE3MDM2Nzg4OTgsImV4cCI6MTcwMzY4MDcyOCwiaWF0IjoxNzAzNjc4OTI4LCJpc3MiOiJMZWFkU3F1YXJlZCIsImF1ZCI6ImNybTRiMmMuY29tIn0.a8N0pmN2mjsYayUPC1UYWWGCIM5b-IVcXcfcR3id3zY',
          TokenExpirationTime: '2023-12-27T12:28:48Z',
          RefreshTokenExpirationTime: '2023-12-28T06:08:48Z',
          TokenValidityInMinutes: 1080
        },
        Tenant: {
          RegionId: '1',
          DefinedWeek: 'Tuesday to Monday'
        },
        User: {
          Id: 'df01b7f0-a351-11ec-86c0-02930afc2f3c',
          OrgCode: '9695',
          DateFormat: 'dd/mm/yy',
          TimeZone: '-12:00'
        }
      };
    }
    return null;
  })
}));

jest.mock('common/utils/helpers/helpers.ts', () => ({
  ...jest.requireActual('common/utils/helpers/helpers.ts'),
  getEnvConfig: jest.fn().mockReturnValue('https://app.marvin.crm4b2c.com/api/logger/r1/v1')
}));

jest.mock('apps/forms/utils.ts', () => ({
  ...jest.requireActual('apps/forms/utils.ts'),
  sendPostMessage: jest.fn(),
  getFormsRenderUrl: jest.fn().mockReturnValue('https://forms.marvin.crm4b2c.com/?isSWLite=true')
}));

describe('Show Forms', () => {
  it('Should show forms, when invoked', async () => {
    const { queryByTestId, debug } = render(
      <Forms
        shouldShow={true}
        setShouldShow={() => {}}
        config={{
          Config: { FormId: 'forms', IsDefaultForm: true }
        }}
      />
    );
    await waitFor(
      () => {
        expect(queryByTestId('forms-container')).toBeInTheDocument();
      },
      { interval: 500 }
    );
  });

  it('Sends postMessage to iframe on load', async () => {
    const { container, queryByTestId, debug } = render(
      <Forms
        shouldShow={true}
        setShouldShow={() => {}}
        config={{
          Config: { FormId: ',forms', IsDefaultForm: true }
        }}
      />
    );

    await waitFor(() => {
      expect(queryByTestId('forms-container')).toBeInTheDocument();
    });
    // Simulate the load event on the iframe
    const postMessageMock = jest.fn();
    // Check if postMessage was called with the expected data and target origin
    await waitFor(() => {
      const iframe: HTMLIFrameElement = screen.queryByTestId('iframe') as HTMLIFrameElement;
      if (iframe) {
        (iframe.contentWindow || {})['postMessage'] = postMessageMock;
        const event = new Event('load');
        iframe.dispatchEvent(event);
        expect(iframe.classList.contains('hide')).toBe(false);
      }
    });
  });

  it('Receives postMessage from iframe', async () => {
    const SetShowModal = jest.fn();
    const { queryByTestId } = render(
      <Forms
        shouldShow={true}
        setShouldShow={SetShowModal}
        config={{
          Config: { FormId: ',forms', IsDefaultForm: true }
        }}
      />
    );

    await waitFor(() => {
      expect(queryByTestId('forms-container')).toBeInTheDocument();
    });

    const iframe: HTMLIFrameElement = screen.queryByTestId('iframe') as HTMLIFrameElement;
    if (iframe) {
      fireEvent.load(iframe);
      expect(iframe.classList.contains('hide')).toBe(false);
      const mockData = {
        callbackTriggerId: 'SetShowModal',
        arguments: [true]
      };
      const mockDataByForms = {
        isFormReady: true
      };

      const formsReadyMessage = new MessageEvent('message', {
        data: mockDataByForms
      });

      iframe.dispatchEvent(formsReadyMessage);
      const formsEvent = new MessageEvent('message', {
        data: mockData
      });
      iframe.dispatchEvent(formsEvent);
      expect(SetShowModal).toHaveBeenCalledTimes(0);
    }
  });

  it('Forms module data is not available', async () => {
    (helperData.getEnvConfig as jest.Mock).mockReturnValue(null);
    expect(generateAuthStorageData()).toBe(null);
  });

  it('Forms authentication data failing to load', async () => {
    (storageHelpers.getItem as jest.Mock).mockReturnValue(null);
    expect(generateAuthStorageData()).toBe(null);
  });

  it('Should return null when callback data is not passed', () => {
    const data = null;
    expect(generateCallbackMapFromFormsData(null)).toBe(null);
  });
});
