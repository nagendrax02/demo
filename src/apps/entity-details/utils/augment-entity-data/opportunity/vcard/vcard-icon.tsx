import { IIconConfig, IconContentType } from '../../../../types';
import styles from './vcard-config.module.css';
import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Opportunity = withSuspense(lazy(() => import('src/assets/custom-icon/Opportunity')));

const getAugmentedIcon = (): IIconConfig => {
  return {
    content: 'Opporunity',
    contentType: IconContentType.Icon,
    iconElement: <Opportunity />,
    customStyleClass: styles.opportunity_icon
  };
};

export { getAugmentedIcon };
