import React from 'react';
import styles from './global-search-result-card.module.css';
import { IDescription, IHeading, ISearchRecord, ISearchResult } from '../../global-searchV2.types';
import ResultCardHeadingSection from '../result-card-heading-section';
import ResultCardDescriptionSection from '../result-card-description-section';
import { IconButton } from '@lsq/nextgen-preact/v2/button';
import { Close as CloseIcon } from 'assets/custom-icon/v2';
import { EntityType } from 'common/types';
import { classNames } from 'common/utils/helpers/helpers';
import { defaultResults, resultsCacheConfig } from '../../constants';
import { setRecentSearchResults } from '../../global-searchV2.store';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import ViewMoreIcon from 'assets/custom-icon/ViewMoreIcon';

export interface IGlobalSearchResultCardProps {
  entityId: string;
  entityType: EntityType;
  canRemove: boolean;
  heading: IHeading;
  description: IDescription[];
  ownerName: IDescription;
  searchText: string;
  isSelected: boolean;
  onClick: () => void;
  redirectionHandler?: () => void;
}

const GlobalSearchResultCard: React.FC<IGlobalSearchResultCardProps> = ({
  entityId,
  entityType,
  canRemove,
  heading,
  description,
  ownerName,
  searchText,
  isSelected,
  onClick,
  redirectionHandler = (): void => {}
}) => {
  const removeSearchResultFromCache = (): void => {
    const cachedResults: ISearchResult =
      getItem<ISearchResult>(StorageKey.GlobalSearchResultsHistory) ?? defaultResults;

    const uniqueProperty = resultsCacheConfig[entityType];
    if (!uniqueProperty) {
      return;
    }

    const recordIndex = cachedResults.Data?.findIndex(
      (item: ISearchRecord) => item[uniqueProperty] === entityId
    );

    if (isNaN(recordIndex) || recordIndex === -1) {
      return;
    }

    const updatedData: ISearchRecord[] = [
      ...cachedResults.Data.slice(0, recordIndex),
      ...cachedResults.Data.slice(recordIndex + 1)
    ];
    const updatedCache: ISearchResult = {
      Data: updatedData,
      TotalRecords: updatedData.length
    };
    setRecentSearchResults(updatedCache);
    setItem(StorageKey.GlobalSearchResultsHistory, updatedCache);
  };

  return (
    <div className={styles.recent_search_card_wrapper}>
      <button
        className={`${styles.recent_search_card} ${isSelected ? styles.selected : ''} `}
        onClick={onClick}
        tabIndex={0}
        onDoubleClick={redirectionHandler}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onClick();
          }
        }}>
        <button className={styles.view_more_icon} onClick={redirectionHandler}>
          <ViewMoreIcon />
        </button>
        <ResultCardHeadingSection heading={heading} searchText={searchText} />

        <ResultCardDescriptionSection
          description={description}
          searchText={searchText}
          ownerName={ownerName}
        />
      </button>
      {canRemove ? (
        <IconButton
          onClick={removeSearchResultFromCache}
          size="sm"
          icon={<CloseIcon type="outline" className={classNames(styles.actions)} />}
          variant="tertiary-gray"
        />
      ) : null}
    </div>
  );
};

export default GlobalSearchResultCard;
