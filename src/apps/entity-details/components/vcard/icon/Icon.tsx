import Shimmer from '@lsq/nextgen-preact/shimmer';
import { IIconConfig, IconContentType } from '../../../types';
import styles from './icon.module.css';
import IconLoader from '@lsq/nextgen-preact/icon';

interface IIcon extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'data-testid'> {
  config: IIconConfig | undefined;
  isLoading: boolean;
  customStyleClass?: string;
}

const Icon = ({ config, isLoading, customStyleClass, ...otherProps }: IIcon): JSX.Element => {
  const getIconContent = (): JSX.Element => {
    switch (config?.contentType) {
      case IconContentType.Image:
        return <img src={config?.content} className={config.customStyleClass} />;
      case IconContentType.Icon:
        return config.iconElement || <IconLoader name={config?.content} /> || <></>;
      default:
        return <span>{config?.content}</span>;
    }
  };

  return (
    <>
      {!isLoading ? (
        <div
          className={`${styles.icon_container} ${customStyleClass} ${config?.customStyleClass}`}
          data-testid="vcard-icon"
          title={config?.content}
          {...otherProps}>
          {getIconContent()}
        </div>
      ) : (
        <Shimmer className={styles.icon_shimmer} dataTestId="icon-shimmer" />
      )}
    </>
  );
};

Icon.defaultProps = {
  customStyleClass: ''
};

export default Icon;
