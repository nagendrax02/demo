import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../external-app.module.css';

interface IIconHandler {
  iconURL: string;
  isActive: boolean;
}

const IconHandler = (props: IIconHandler): React.ReactNode => {
  const { iconURL, isActive } = props;

  const getColor = (): string => {
    return isActive ? 'rgb(var(--marvin-secondary-text))' : 'rgb(var(--marvin-quaternary-text))';
  };

  const checkURL = (): boolean => {
    return iconURL?.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
  };

  const iconHandler = (): React.ReactNode => {
    return (
      <Icon
        name={iconURL || 'perm_identity'}
        variant={IconVariant.Filled}
        customStyleClass={styles.icon}
        style={{
          color: getColor(),
          fill: getColor()
        }}
      />
    );
  };

  const imageHandler = (): JSX.Element => {
    if (iconURL) {
      return (
        <div className={styles.icon}>
          <img src={iconURL} width={24} height={24} crossOrigin="anonymous" />
        </div>
      );
    }
    return <></>;
  };

  return checkURL() ? imageHandler() : iconHandler();
};

export default IconHandler;
