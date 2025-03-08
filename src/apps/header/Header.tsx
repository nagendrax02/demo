import { isMobileDevice } from 'common/utils/helpers';
import WebHeader from './components/web-header';
import MobileHeader from './components/mobile-header';

const Header = (): JSX.Element => {
  return <>{isMobileDevice() ? <MobileHeader /> : <WebHeader />}</>;
};

export default Header;
