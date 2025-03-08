import { trackError } from 'common/utils/experience/utils/track-error';
import { ILeadTypeConfiguration, ITabResponse } from 'apps/smart-views/smartviews.types';
import { safeParseJson } from '../helpers';
import { CallerSource } from '../rest-client';
import { fetchLeadTypeConfig } from './settings';
import { defaultLeadColumns } from 'apps/smart-views/augment-tab-data/lead/constants';
import { getLDTypeConfigFromRawData } from 'apps/smart-views/augment-tab-data/common-utilities/utils';

export const getLeadTypeBasedDefaultColumns = async (tabData: ITabResponse): Promise<string> => {
  try {
    const {
      TabContentConfiguration: { FetchCriteria }
    } = tabData;

    let selectedLeadType = ((safeParseJson(
      FetchCriteria?.LeadTypeConfiguration || ''
    ) as ILeadTypeConfiguration[]) || {})?.[0]?.LeadTypeInternalName;
    if (!selectedLeadType) {
      selectedLeadType = (
        (await getLDTypeConfigFromRawData(tabData.Id)) as ILeadTypeConfiguration[]
      )?.[0]?.LeadTypeInternalName;
    }

    const selectedLeadTypeConfig = (await fetchLeadTypeConfig(CallerSource.SmartViews))?.[
      selectedLeadType
    ];

    return selectedLeadTypeConfig?.IsDefault
      ? defaultLeadColumns
      : selectedLeadTypeConfig?.LeadGridConfiguration?.replaceAll('CheckBoxColumn,', '');
  } catch (err) {
    trackError(err);
    return defaultLeadColumns;
  }
};
