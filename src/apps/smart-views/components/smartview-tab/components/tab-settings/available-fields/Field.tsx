import Checkbox from '@lsq/nextgen-preact/v2/checkbox';
import styles from './available-fields.module.css';
import { getSearchTextHighlightedField } from './utils';
import { classNames } from 'common/utils/helpers/helpers';
import { IAvailableField } from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import { RestrictedEye } from 'assets/custom-icon/v2';

interface IField {
  metadata: IAvailableField;
  searchText: string;
  handleFieldSelection: (metadata: IAvailableField) => void;
}

const Field = (props: IField): JSX.Element => {
  const { metadata, searchText, handleFieldSelection } = props;

  return (
    <div
      className={`${styles.field} ${metadata?.isDisabled ? styles.disabled : ''}`}
      data-testid={metadata?.schemaName}>
      <Checkbox
        checked={!!metadata?.isSelected}
        changeSelection={() => {
          handleFieldSelection(metadata);
        }}
        customStyleClass={`${metadata?.isDisabled ? styles.pointer_events_none : ''}`}
        size="sm"
        disabled={metadata?.isDisabled}
      />
      <button
        className={`${classNames(styles.field_name, 'ng_sh_sb', 'ng_v2_style')} ${
          metadata?.isDisabled ? styles.pointer_events_none : ''
        }`}
        onClick={() => {
          handleFieldSelection(metadata);
        }}
        title={metadata?.displayName}>
        {getSearchTextHighlightedField(metadata?.displayName, searchText)}
      </button>
      {metadata.isRestricted ? (
        <RestrictedEye type="filled" className={styles.visibility_icon} />
      ) : null}
    </div>
  );
};

export default Field;
