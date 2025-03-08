/* istanbul ignore file */
import { BgColor } from '../../types';
import StyledIcon from '../shared/styled-icon';

const Icon = (): JSX.Element => {
  return <StyledIcon name="fullscreen" bgColor={BgColor.Blue700} />;
};

export default Icon;
