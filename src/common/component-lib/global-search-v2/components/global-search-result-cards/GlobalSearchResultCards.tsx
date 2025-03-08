import React, { ReactNode } from 'react';
import GlobalSearchResultCard from '../global-search-result-card';
import { EntityType } from 'common/types';
import {
  IRecentSearchCardLayout,
  IRecentSearchResultsProps,
  ISearchRecord,
  ISearchResult
} from '../../global-searchV2.types';
import { getLayoutForEntity, mapLayoutValues } from '../../utils/utils';

interface IGlobalSearchResultCardsProps extends IRecentSearchResultsProps {
  searchText: string;
  entityId: string;
  canRemove: boolean;
  onSelect: (entityId: string, record: ISearchRecord, canRemove: boolean) => void;
}

const getBaseLayout = (entity: ISearchRecord): IRecentSearchCardLayout | null => {
  return entity ? getLayoutForEntity(entity) : null;
};

const mapLayout = ({
  canRemove,
  baseLayout,
  record,
  searchText,
  entityId: selectedEntityId,
  onSelect
}: {
  canRemove: boolean;
  baseLayout: IRecentSearchCardLayout;
  record: ISearchRecord;
  searchText: string;
  entityId: string;
  onSelect: IGlobalSearchResultCardsProps['onSelect'];
}): ReactNode => {
  const entityType: EntityType = record?.EntityType;

  const mappedLayout = mapLayoutValues(baseLayout, record);
  if (!mappedLayout) return null;

  const isSelected = mappedLayout.id === selectedEntityId;
  return (
    <GlobalSearchResultCard
      entityType={entityType}
      entityId={mappedLayout.id}
      canRemove={canRemove}
      key={mappedLayout.id}
      heading={mappedLayout.heading}
      description={mappedLayout.description}
      ownerName={mappedLayout.ownerName}
      searchText={searchText}
      isSelected={isSelected}
      onClick={() => {
        onSelect(mappedLayout.id, record, canRemove);
      }}
      redirectionHandler={mappedLayout.redirectionHandler}
    />
  );
};

const renderEntityResults = ({
  canRemove,
  resultData,
  searchText,
  entityId,
  onSelect
}: {
  canRemove: boolean;
  resultData: ISearchResult;
  searchText: string;
  entityId: string;
  onSelect: IGlobalSearchResultCardsProps['onSelect'];
}): ReactNode => {
  const records: ISearchRecord[] = resultData.Data;
  return records.map((record) => {
    const baseLayout = getBaseLayout(record);
    if (!baseLayout) return null;
    return mapLayout({
      canRemove,
      baseLayout,
      record,
      searchText,
      entityId,
      onSelect
    });
  });
};

const GlobalSearchResultCards: React.FC<IGlobalSearchResultCardsProps> = ({
  data,
  searchText,
  entityId,
  canRemove,
  onSelect
}): JSX.Element => {
  return (
    <>
      {renderEntityResults({
        canRemove,
        resultData: data,
        searchText,
        entityId,
        onSelect
      })}
    </>
  );
};

export default GlobalSearchResultCards;
