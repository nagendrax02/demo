import { lazy, memo } from 'react';
import styles from './header.module.css';
import { augmentHeaderData } from './utils';
import NavItems from './components/NavSection';
import HelpSection from './components/HelpSection';
import CompanyLogo from './components/CompanyLogo';
import DraftsMenu from 'apps/forms/draft-menu/DraftsMenu';
import { IHeader } from './header.types';
import PostLogin from './PostLogin';
import useDefaultRouting from './hooks/use-default-routing';

const AppTabs = lazy(() => import('common/component-lib/app-tabs'));

interface IMipMenu {
  appTabsEnabled: boolean;
  header?: IHeader[];
}

const MipMenu = ({ appTabsEnabled, header }: IMipMenu): JSX.Element => {
  const headerData = augmentHeaderData({ header });
  const { InnerTopMenu, CustomInnerTopMenu, PostLoginMenu, HelpMenu } = headerData;
  useDefaultRouting({ menu: InnerTopMenu });

  return (
    <>
      {Object.keys(headerData).length ? (
        <div className={styles.header_wrapper}>
          <div className={styles.header_container}>
            <CompanyLogo />
            <div className={styles.primary_menu}>
              {InnerTopMenu ? <NavItems items={InnerTopMenu} /> : null}
              {CustomInnerTopMenu ? <NavItems items={CustomInnerTopMenu} /> : null}
              {appTabsEnabled ? <AppTabs /> : null}
            </div>
            <div className={styles.secondary_menu}>
              <div className={styles.divider} />
              <DraftsMenu />
              {HelpMenu?.[0]?.Children?.length ? (
                <HelpSection helpItem={HelpMenu[0].Children[0]} />
              ) : null}
              <PostLogin postLoginMenu={PostLoginMenu} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

MipMenu.defaultProps = {
  header: []
};

export default memo(MipMenu);
