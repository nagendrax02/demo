import FeatureRestriction from 'common/utils/feature-restriction';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import Count from '../count';
import Edit from '../edit';
import ButtonText from '../edit/ButtonText';
import Hide from '../hide';
import Search from '../search';
import styles from './header.module.css';
import { ENTITY_FEATURE_RESTRICTION_CONFIG_MAP } from 'common/constants/feature-restriction';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const isLargeResolution = (): boolean => {
  return typeof window === 'object' && window.innerWidth >= 1025;
};

interface IHeader {
  tabId: string;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const Header = ({ tabId, entityDetailsCoreData }: IHeader): JSX.Element => {
  const getEditActionElement = (): JSX.Element => {
    const editActionElement = <Edit tabId={tabId} entityDetailsCoreData={entityDetailsCoreData} />;

    const featureRestrictionConfig =
      ENTITY_FEATURE_RESTRICTION_CONFIG_MAP?.[entityDetailsCoreData?.entityDetailsType];
    if (ENTITY_FEATURE_RESTRICTION_CONFIG_MAP?.[entityDetailsCoreData?.entityDetailsType]) {
      return (
        <FeatureRestriction
          actionName={featureRestrictionConfig?.edit?.actionName}
          moduleName={featureRestrictionConfig?.edit?.moduleName}
          callerSource={featureRestrictionConfig?.edit?.callerSource}
          placeholderElement={
            <Button text={<ButtonText action={{ isLoading: true }} />} onClick={() => {}} />
          }>
          {editActionElement}
        </FeatureRestriction>
      );
    }
    return editActionElement;
  };

  return (
    <section data-testid="ead-header" className={styles.header}>
      {isLargeResolution() ? (
        <>
          <div className={styles.left}>
            <Count value={100} />
            <Search />
          </div>
          <div className={styles.right}>
            <Hide />
            {getEditActionElement()}
          </div>
        </>
      ) : (
        <>
          <div className={styles.left}>
            <Count value={100} />
            <Hide />
          </div>
          <div className={styles.right}>
            <Search />
            {getEditActionElement()}
          </div>
        </>
      )}
    </section>
  );
};

export default Header;
