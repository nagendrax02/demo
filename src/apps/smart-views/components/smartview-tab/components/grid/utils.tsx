import { ICornerActionConfig } from '@lsq/nextgen-preact/v2/grid/grid.types';
import { ManageColumn } from 'src/assets/custom-icon';
import styles from '../../smartviews-tab.module.css';
import { ITabConfig } from '../../smartview-tab.types';
import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';
import { getFilterCount } from '../header/search-filter/utils';
import { IFeatureRestrictionConfig } from 'apps/entity-details/types/entity-data.types';
import { isSmartviewTab } from 'apps/smart-views/utils/utils';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';
import { MANAGE_COLUMN_FEATURE_RESTRICTION_MAP } from '../../../../constants/constants';
import { RefObject } from 'react';

export const getCornerActionConfig = async (
  tabId: string,
  setShow: (show: boolean) => void
): Promise<ICornerActionConfig | undefined> => {
  const MANAGE_COLUMN_DISABLED_TABS = ['manage-lists'];

  let featureRestrictionConfig: IFeatureRestrictionConfig | undefined =
    MANAGE_COLUMN_FEATURE_RESTRICTION_MAP?.[tabId];

  if (isSmartviewTab(tabId)) {
    featureRestrictionConfig = MANAGE_COLUMN_FEATURE_RESTRICTION_MAP.Smartviews;
  }
  const isManageColumnRestricted = featureRestrictionConfig
    ? await isFeatureRestricted(featureRestrictionConfig)
    : false;

  if (!isManageColumnRestricted && !MANAGE_COLUMN_DISABLED_TABS.includes(tabId)) {
    return {
      icon: <ManageColumn className={styles.corner_action} />,
      onClick: (): void => {
        setShow(true);
      },
      title: 'Manage Columns'
    };
  }

  return undefined;
};

interface IGetErrorType {
  apiFailure?: boolean;
  apiStatus?: number;
  tabId: string;
  tabData?: ITabConfig;
  recordCount?: number;
}

const isNoMatchingRecordsError = ({ tabData, recordCount, tabId }: IGetErrorType): boolean => {
  if (tabData) {
    const filterCount = getFilterCount(tabId, tabData);
    return recordCount === 0 && filterCount > 0;
  }
  return false;
};

const isEmptyRecordsError = ({ tabId, tabData, recordCount }: IGetErrorType): boolean => {
  if (tabData) {
    const filterCount = getFilterCount(tabId, tabData);
    return recordCount === 0 && filterCount === 0;
  }
  return false;
};

const isTeamNotifiedError = ({ apiFailure }: IGetErrorType): boolean => {
  return !!apiFailure;
};

const isUnexpectedError = ({ apiFailure, apiStatus }: IGetErrorType): boolean => {
  return !!(apiFailure && apiStatus === 404);
};

export const getErrorType = (params: IGetErrorType): ErrorPageTypes | undefined => {
  if (isUnexpectedError(params)) {
    return 'unexpectedError';
  } else if (isTeamNotifiedError(params)) {
    return 'teamNotified';
  } else if (isNoMatchingRecordsError(params)) {
    return 'noMatchingRecords';
  } else if (isEmptyRecordsError(params)) {
    return 'emptyRecords';
  }

  return undefined;
};

export const scrollToFirstRow = (gridRef: RefObject<HTMLDivElement>): void => {
  if (gridRef?.current?.scrollTo) {
    gridRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
