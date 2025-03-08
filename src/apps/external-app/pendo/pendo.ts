/* eslint-disable prefer-rest-params */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-var */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
//disabled rules to get pendo script content

import { AuthKey } from 'common/utils/authentication/authentication.types';
import { getMiPPreReqData } from 'common/utils/helpers/helpers';
import { isScriptLoaded, setLoadedScripts } from '../event-handler/event-handler.store';
import { IPendoOptions } from './pendo.types';

const pendoId = 'pendo-id';

const getPendoOptions = (): IPendoOptions | null => {
  const auth = getMiPPreReqData();
  if (!auth) return null;
  return {
    orgCode: auth[AuthKey.OrgCode],
    organizationName: auth[AuthKey.DisplayName],
    customerType: auth[AuthKey.CustomerType],
    userEmailAddress: auth[AuthKey.UserEmail],
    userRole: auth[AuthKey.Role],
    userId: auth[AuthKey.UserId],
    tenantIndustry: auth[AuthKey.Industry],
    tenantSubIndustry: auth[AuthKey.SubIndustry],
    tenantBusinessType: auth[AuthKey.BusinessType],
    accountPlan: auth[AuthKey.Plan],
    regionId: auth[AuthKey.RegionId],
    clusterId: auth[AuthKey.ClusterID],
    userCreationDate: auth[AuthKey.UserCreatedOn],
    isSystemUser: auth[AuthKey.IsDefaultOwner] ? 'Yes' : 'No',
    creationDate: auth[AuthKey.TenantCreatedOn],
    tenantRenewalDate: auth[AuthKey.RenewalDate],
    isAgency: '0',
    accountTimeZoneValue: auth[AuthKey.AccountTimezone],
    userRegionId: auth[AuthKey.RegionId],
    userClusterId: auth[AuthKey.ClusterID],
    apiKey: '2c38642a-1d45-4700-5b16-e4490072a8c9',
    loginAppUrl: window.location.origin,
    appType: 'Marvin',
    userDesignation: '',
    accountStartingDate: '',
    tenantBillingOption: '',
    tenantCity: '',
    tenantCountry: '',
    tenantSuccessOwner: '',
    tenantAccountOwner: ''
  };
};

const integratePendo = (): void => {
  try {
    const pendoOptions = getPendoOptions();
    if (!pendoOptions) throw new Error('Failed to get pendo options');

    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDate = new Date();
    (function (p, e, n, d, o) {
      var v, w, x, y, z;
      o = p[d] = p[d] || {};
      //@ts-ignore: disabled for pendo
      o._q = o._q || [];
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
      for (w = 0, x = v.length; w < x; ++w)
        (function (m) {
          //@ts-ignore: disabled for pendo
          o[m] =
            //@ts-ignore: disabled for pendo
            o[m] ||
            function () {
              //@ts-ignore: disabled for pendo
              o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
            };
        })(v[w]);
      y = e.createElement(n);
      y.async = !0;
      y.src = 'https://cdn.pendo.io/agent/static/' + pendoOptions.apiKey + '/pendo.js';
      z = e.getElementsByTagName(n)[0];
      z.parentNode.insertBefore(y, z);
    })(window, document, 'script', 'pendo');

    // Call this whenever information about your visitors becomes available
    // Please use Strings, Numbers, or Bools for value types.

    //@ts-ignore: disabled for pendo
    pendo.initialize({
      visitor: {
        id: pendoOptions.userId,
        email: pendoOptions.userEmailAddress,
        role: pendoOptions.userRole,
        creationDate: pendoOptions.userCreationDate,
        isSupportUser: pendoOptions.isSystemUser,
        newLogin:
          document.referrer.trim() != '' &&
          document.referrer.includes(pendoOptions.loginAppUrl) &&
          performance.navigation.type != performance.navigation.TYPE_RELOAD,
        weekday: weekday[currentDate.getDay()],
        designation: pendoOptions.userDesignation,
        appType: pendoOptions.appType
      },

      account: {
        id: pendoOptions.orgCode,
        name: pendoOptions.organizationName,
        plan: pendoOptions.accountPlan,
        customerType: pendoOptions.customerType,
        creationDate: pendoOptions?.accountStartingDate,
        businessType: pendoOptions.tenantBusinessType,
        industry: pendoOptions.tenantIndustry,
        subIndustry: pendoOptions.tenantSubIndustry,
        renewalDate: pendoOptions.tenantRenewalDate,
        city: pendoOptions.tenantCity,
        country: pendoOptions.tenantCountry,
        successOwner: pendoOptions.tenantSuccessOwner,
        accountOwner: pendoOptions.tenantAccountOwner,
        isAgency: pendoOptions.isAgency,
        timeZone: pendoOptions.accountTimeZoneValue,
        billingOption: pendoOptions.tenantBillingOption,
        regionId: pendoOptions.userRegionId,
        clusterId: pendoOptions.userClusterId
      }
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const initializePendo = (): void => {
  try {
    if (isScriptLoaded(pendoId)) {
      return;
    }
    setLoadedScripts(pendoId);

    integratePendo();
  } catch (error) {
    console.log(error);
  }
};
