import withSuspense from '@lsq/nextgen-preact/suspense';
import { IBulkSelectionMode } from '../bulk-update.store';
import { ISettings, InputId } from '../bulk-update.types';
import styles from './selection-mode.module.css';
import { lazy } from 'react';

interface INLead {
  disabled?: boolean;
  settingConfig: ISettings;
  bulkSelectionMode: IBulkSelectionMode | undefined;
  setBulkSelectionMode: (value: IBulkSelectionMode) => void;
  pluralRepName: string;
  error?: InputId;
}

const NumberInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/number-input')));

const NLead = (props: INLead): React.ReactNode => {
  const { disabled, bulkSelectionMode, settingConfig, setBulkSelectionMode, pluralRepName, error } =
    props;

  const handleChange = (value: string): void => {
    const numberValue = Number(value);
    const maxCountAllowed = Number(settingConfig?.BulkLeadUpdateCount);
    let updatedValue: number | string = numberValue;

    if (numberValue > maxCountAllowed) {
      updatedValue = maxCountAllowed;
    } else if (numberValue <= 0) {
      updatedValue = 0;
    }
    setBulkSelectionMode({ ...bulkSelectionMode, nLead: `${updatedValue}` });
  };

  return (
    <div className={styles.n_lead_wrapper}>
      <span className={styles.select}>Select</span>
      <span>
        <NumberInput
          setValue={handleChange}
          value={bulkSelectionMode?.nLead as string}
          disabled={disabled}
          forbidDecimal
          id={InputId.NLeads}
          error={error === InputId?.NLeads}
        />
      </span>

      <span title={pluralRepName} className={styles.lead}>
        {pluralRepName}
      </span>
    </div>
  );
};

NLead.defaultProps = {
  disabled: true,
  error: undefined
};

export default NLead;
