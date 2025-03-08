import MipMenu from 'apps/mip-menu';
import MiPHeader from 'common/component-lib/mip-header';
import { IHeader } from 'apps/mip-menu/header.types';
import { isMiP } from 'common/utils/helpers';
import useAppTabsEnabled from '../../utils/use-app-tabs-enabled';

interface IMiPNavigation {
  header?: IHeader[];
}

const MipNavigation = ({ header }: IMiPNavigation): JSX.Element => {
  const { isAppTabsEnabled } = useAppTabsEnabled();

  return (
    <>
      <MipMenu appTabsEnabled={isAppTabsEnabled} header={header} />
      {isMiP() ? <MiPHeader appTabsEnabled={isAppTabsEnabled} /> : null}
    </>
  );
};

MipNavigation.defaultProps = {
  header: []
};

export default MipNavigation;
