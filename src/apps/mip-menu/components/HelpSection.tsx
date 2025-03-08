import { IHeader } from '../header.types';
import styles from '../header.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import { Theme } from 'common/types';
import { lazy, useRef, useState } from 'react';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));
const GlobalSearchV2 = withSuspense(
  lazy(() => import('common/component-lib/global-search-v2/GlobalSearchV2'))
);

interface IHelpSection {
  helpItem: IHeader;
}

const HelpSection = ({ helpItem }: IHelpSection): JSX.Element => {
  const leadRepName = useLeadRepName();
  const [showSearch, setShowSearch] = useState(false);
  const searchLoaded = useRef(false);
  const handleSearch = (): void => {
    setShowSearch(true);
    searchLoaded.current = true;
  };
  return (
    <>
      <div className={styles.profile_item_wrapper}>
        <Tooltip
          content={`Search ${leadRepName.PluralName}`}
          placement={Placement.Vertical}
          theme={Theme.Dark}
          trigger={[Trigger.Hover]}>
          <span className={styles.profile_item} onClick={handleSearch}>
            <Icon customStyleClass={styles.help} name="search" />
          </span>
        </Tooltip>
      </div>
      <div className={styles.profile_item_wrapper}>
        <Tooltip
          content={'Help Center'}
          placement={Placement.Vertical}
          theme={Theme.Dark}
          trigger={[Trigger.Hover]}>
          <a
            href={helpItem.ActionName}
            target="_blank"
            className={styles.profile_item}
            rel="noopener">
            <Icon customStyleClass={styles.help} name="help_outline" />
          </a>
        </Tooltip>
      </div>
      {showSearch ? <GlobalSearchV2 setShow={setShowSearch} /> : null}
    </>
  );
};

export default HelpSection;
