import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import styles from './opp-status-highlighted.module.css';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { getDarkModeClass } from 'common/utils/helpers/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IOppStatusHighlighted {
  property: IEntityProperty;
}

const OppStatusHighlighted = ({ property }: IOppStatusHighlighted): JSX.Element => {
  const value = getDarkModeClass(property?.value || '')?.toLowerCase() || '';
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`${styles.status_text} ${styles[value]}`}>
      <Tooltip
        trigger={[Trigger.Click]}
        placement={Placement.Vertical}
        content={
          <>
            <b>Status: </b> {property.value}
          </>
        }>
        <>{property.value}</>
      </Tooltip>
    </span>
  );
};

export default OppStatusHighlighted;
