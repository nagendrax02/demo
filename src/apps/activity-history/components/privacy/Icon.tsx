import { BgColor } from '../../types';
import StyledIcon from '../shared/styled-icon';

const Icon = (): JSX.Element => {
  return <StyledIcon name="security" bgColor={BgColor.Red700} />;
};

export default Icon;
