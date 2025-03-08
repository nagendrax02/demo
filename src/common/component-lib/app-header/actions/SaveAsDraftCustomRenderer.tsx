import { classNames } from 'common/utils/helpers';
import styles from './actions.module.css';
import SaveToDraftIcon from 'assets/custom-icon/v2/SaveToDraft';

interface ISaveAsDraftProps {
  handleClick: () => void;
  draftCount: number;
}

const SaveAsDraftCustomRenderer = ({ handleClick, draftCount }: ISaveAsDraftProps): JSX.Element => {
  return (
    <button
      onClick={handleClick}
      className={classNames(styles.action_button, styles.draft_button_icon)}
      title={`Drafts`}>
      <SaveToDraftIcon type="outline" />
      {draftCount ? (
        <div className={classNames(styles.draft_button_count, 'ng_v2_style')}>{draftCount}</div>
      ) : null}
    </button>
  );
};

export default SaveAsDraftCustomRenderer;
