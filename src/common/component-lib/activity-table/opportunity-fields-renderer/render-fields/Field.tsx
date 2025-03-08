import styles from '../opportunity-fields-renderer.module.css';

interface IField {
  displayName: string;
  value: string;
  key: string;
  renderValues?: JSX.Element[];
}

const Field = ({ displayName, value, key, renderValues }: IField): JSX.Element => (
  <div key={key} className={styles.field_container}>
    <div className={styles.field_display_name} title={displayName} aria-label={displayName}>
      {displayName}
    </div>
    <div className={styles.field_value} aria-label={value}>
      {renderValues ? [...renderValues] : value}
    </div>
  </div>
);

Field.defaultProps = {
  renderValues: undefined
};

export default Field;
