import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import styles from './properties.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { TOOLTIP_CHAR_LIMIT } from 'common/constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IName {
  name: string;
  isLoading?: boolean;
}

const Name = (props: IName): JSX.Element => {
  const { name, isLoading } = props;

  return (
    <>
      {isLoading ? (
        <Shimmer className={styles.shimmer_name} />
      ) : (
        <div className={styles.property_name}>
          {name?.length > TOOLTIP_CHAR_LIMIT ? (
            <Tooltip content={name} placement={Placement.Horizontal} trigger={[Trigger.Hover]}>
              <>{name}</>
            </Tooltip>
          ) : (
            name
          )}
        </div>
      )}
    </>
  );
};

Name.defaultProps = {
  isLoading: false
};
export default Name;
