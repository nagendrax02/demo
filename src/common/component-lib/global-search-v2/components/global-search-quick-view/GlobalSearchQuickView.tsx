import React, { ReactNode } from 'react';
import {
  ISearchRecord,
  ISearchResult
} from 'common/component-lib/global-search-v2/global-searchV2.types';
import {
  shouldRenderQuickViewNull,
  shouldShowPlaceholder
} from 'common/component-lib/global-search-v2/utils/utils';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import QuickView from 'v2/quick-view/QuickView';
import { EntityType } from 'common/types';

interface IGlobalSearchQuickViewProps {
  error: boolean;
  entityId: string;
  entityType: EntityType;
  searchText: string;
  searchResults: ISearchResult;
  entityRecord?: ISearchRecord;
}

const GlobalSearchQuickView: React.FC<IGlobalSearchQuickViewProps> = ({
  error,
  entityId,
  searchText,
  entityType,
  searchResults,
  entityRecord
}): ReactNode => {
  const cachedResults: ISearchResult | { TotalRecords: number } = getItem<ISearchResult>(
    StorageKey.GlobalSearchResultsHistory
  ) ?? { TotalRecords: 0 };

  const resultsData: { cached: number; results: number } = {
    cached: cachedResults.TotalRecords,
    results: searchResults.TotalRecords
  };

  if (error || shouldRenderQuickViewNull(searchText, resultsData)) {
    return null;
  }

  const showPlaceHolder: boolean = shouldShowPlaceholder(
    entityId,
    { error, searchText },
    resultsData
  );
  return (
    <QuickView
      entityId={entityId}
      entityType={entityType}
      showPlaceHolder={showPlaceHolder}
      entityRecord={entityRecord}
    />
  );
};

export default GlobalSearchQuickView;
