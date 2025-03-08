/* istanbul ignore file */
import { BgColor } from '../../types';
import StyledIcon from '../shared/styled-icon';

const Icon = (): JSX.Element => {
  return <StyledIcon name="mail" bgColor={BgColor.Cyan500} />;
};

export default Icon;
