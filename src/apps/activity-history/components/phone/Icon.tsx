/* istanbul ignore file */
import { BgColor } from '../../types';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import StyledIcon from '../shared/styled-icon';

const Icon = (): JSX.Element => {
  return <StyledIcon name="local_phone" bgColor={BgColor.Orange500} variant={IconVariant.Filled} />;
};

export default Icon;
