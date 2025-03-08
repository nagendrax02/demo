import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';

interface IIconHandler {
  name: string;
  iconColor: string;
}

const IconHandler = ({ name, iconColor }: IIconHandler): JSX.Element => {
  if (name?.endsWith('.svg')) {
    return <img src={name} width={24} height={24} alt="" crossOrigin="anonymous" />;
  }

  const getStyle = (): Record<string, string> => {
    if (iconColor) return { color: iconColor };
    return {};
  };

  return (
    <Icon
      name={name ? name : 'perm_identity'}
      variant={IconVariant.Filled}
      aria-hidden="true"
      style={getStyle()}
    />
  );
};

IconHandler.defaultProps = {
  name: '',
  iconColor: ''
};

export default IconHandler;
