/* eslint-disable @typescript-eslint/dot-notation */
import { getItem, StorageKey } from 'src/common/utils/storage-manager';
import scriptLoader from '../utils/script-loader';
import { IAuthenticationConfig } from 'src/common/types';
import { getEnvConfig } from 'src/common/utils/helpers';

const disableWootricOrgCodes = [
  '37714',
  '36278',
  '36386',
  '75974',
  '74860',
  '74859',
  '75806',
  '75975',
  '38123',
  '75505',
  '75772',
  '75757',
  '75813',
  '75813'
];

// eslint-disable-next-line max-lines-per-function
export const loadWootricScript = (): void => {
  const authData = getItem(StorageKey.Auth) as IAuthenticationConfig;
  if (authData?.User?.Id && !disableWootricOrgCodes.includes(authData?.User?.OrgCode)) {
    const { User: userInfo, Tenant } = authData;
    const wootricAccId = getEnvConfig('WOOTRIC_ACC_ID') ?? '';
    let uniqueId = '';
    if (localStorage.getItem('wootric-dev')) {
      window['wootric_survey_immediately'] = true;
      uniqueId = `${Date.now()}`;
    }
    window['wootricSettings'] = {
      email: uniqueId + userInfo?.EmailAddress,
      ['external_id']: uniqueId + userInfo?.Id,
      ['created_at']: Math.ceil(new Date(userInfo?.CreatedOn ?? null)?.valueOf() / 1000),
      ['account_token']: wootricAccId,
      ['scale_color']: 'gradient',
      properties: {
        role: userInfo.Role,
        ['pricing_plan']: Tenant.Plan,
        ['org_id']: userInfo.OrgCode,
        ['org_industry']: Tenant.Industry,
        ['org_subindustry']: Tenant.SubIndustry,
        ['org_name']: Tenant.DisplayName,
        ['customer_type']: Tenant.CustomerType,
        ['user_timezone']: userInfo.TimeZone,
        ['application_type']: 'web',
        ['product_name']: 'Web : Lite'
      }
    };
    // added disable wootric check for UI automation.
    if (!localStorage.getItem('disable-wootric')) {
      scriptLoader({
        id: 'wootric-sdk',
        url: 'https://cdn.wootric.com/wootric-sdk.js',
        onLoad: () => {
          setTimeout(() => {
            window['wootric']?.('run');
          }, 1000);
        },
        delay: 9000,
        loadAsync: true
      });
    }
  }
};
