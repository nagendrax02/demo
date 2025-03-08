import RedirectionIcon from 'src/assets/custom-icon/Redirection';
import styles from './quick-view-redirection-icon.module.css';
interface IQuickViewRedirectionIconProps {
  onClickHandler?: () => void;
}

const QuickViewRedirectionIcon: React.FC<IQuickViewRedirectionIconProps> = ({
  onClickHandler
}: IQuickViewRedirectionIconProps) => {
  return (
    <button
      className={styles.quick_view_redirection_icon}
      onClick={onClickHandler ?? ((): void => {})}>
      <RedirectionIcon />
    </button>
  );
};

export default QuickViewRedirectionIcon;
