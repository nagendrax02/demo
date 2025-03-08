import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import { getTabName } from '../../entity-tabs/utils/general';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IName {
  text: string;
}

const Name = (props: IName): JSX.Element => {
  const { text } = props;

  if (text?.length <= 20) {
    return <div title={text}>{text}</div>;
  }

  return (
    <Tooltip
      theme={Theme.Dark}
      content={text}
      placement={Placement.Vertical}
      trigger={[Trigger.Hover]}>
      <>{getTabName(text)}</>
    </Tooltip>
  );
};

export default Name;
