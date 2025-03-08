import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, useEffect, useRef, useState } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import { EntityType, Theme } from 'common/types';
import styles from '../styles.module.css';
import FeatureRestriction from 'common/utils/feature-restriction';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';
import PlaceholderNavItem from '../placeholder-nav-item';
import getEntityDataManager from 'common/utils/entity-data-manager';
import useHeaderStore from 'apps/header/header.store';
import { FEATURE_NAMES } from 'apps/header/constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
const GlobalSearchV2 = withSuspense(
  lazy(() => import('common/component-lib/global-search-v2/GlobalSearchV2'))
);
const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const Search = (): JSX.Element => {
  const [showSearch, setShowSearch] = useState(false);
  const [leadRepName, setLeadRepName] = useState('Leads');
  const setRestrictedFeature = useHeaderStore((state) => state.setRestrictedFeature);

  const searchLoaded = useRef(false);

  useEffect(() => {
    (async (): Promise<void> => {
      const fetchLeadRepresentationName = (await getEntityDataManager(EntityType.Lead))
        ?.fetchRepresentationName;

      fetchLeadRepresentationName?.(CallerSource.MarvinHeader, '')
        .then((repName) => {
          setLeadRepName(repName?.PluralName ?? 'Leads');
        })
        .catch((err) => {
          trackError(err);
        });
    })();
  }, []);

  const handleSearch = (): void => {
    setShowSearch(true);
    searchLoaded.current = true;
  };

  const handleRestrictionChange = (isRestricted: boolean): void => {
    if (isRestricted) {
      setRestrictedFeature(FEATURE_NAMES.GLOBAL_SEARCH);
    }
  };

  return (
    <>
      <FeatureRestriction
        actionName={
          FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation].GlobalSearch
        }
        moduleName={FeatureRestrictionModuleTypes.Navigation}
        callerSource={CallerSource.MarvinHeader}
        onRestrictionChange={handleRestrictionChange}
        placeholderElement={<PlaceholderNavItem />}>
        <Tooltip
          content={`Search ${leadRepName}`}
          placement={Placement.Horizontal}
          theme={Theme.Dark}
          trigger={[Trigger.Hover]}>
          <div className={styles.nav_item} onClick={handleSearch}>
            <Icon customStyleClass={styles.icon_font_size} name="search" />
          </div>
        </Tooltip>
      </FeatureRestriction>
      {showSearch ? <GlobalSearchV2 setShow={setShowSearch} /> : null}
    </>
  );
};

export default Search;
