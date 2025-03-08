import React, { useEffect, lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { IBulkSelectionMode, SelectionMode } from '../bulk-update.store';
import NLead from './NLead';
import styles from './selection-mode.module.css';
import { BulkMode, IGridConfig, InputId, ISettings } from '../bulk-update.types';
import { actions } from 'apps/entity-details/components/vcard/actions/handle-action/const';
import { classNames } from 'common/utils/helpers/helpers';

const RadioButton = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/radio')));

interface ILeadBulkSelectionMode {
  bulkConfig: IGridConfig;
  pluralRepName: string;
  bulkSelectionMode: IBulkSelectionMode | undefined;
  setBulkSelectionMode: (value: IBulkSelectionMode) => void;
  settingConfig: ISettings;
  actionType?: string;
  error?: InputId;
  numberOfSelectedRecords?: number;
}

const LeadBulkSelectionMode = (props: ILeadBulkSelectionMode): React.ReactNode => {
  const {
    bulkConfig,
    pluralRepName,
    bulkSelectionMode,
    settingConfig,
    actionType,
    setBulkSelectionMode,
    numberOfSelectedRecords,
    error
  } = props;

  const { isSelectAll, totalPages, totalRecords } = bulkConfig || {};

  const handleChange = (value: SelectionMode): void => {
    if (bulkSelectionMode?.mode === BulkMode.NLeads) {
      setBulkSelectionMode({ ...bulkSelectionMode, mode: value });
    } else setBulkSelectionMode({ mode: value });
  };

  useEffect(() => {
    if (isSelectAll) {
      handleChange(BulkMode.SelectedLead);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsConfig = [
    {
      value: BulkMode.SelectedLead,
      children: `${actionType === actions.addToList ? 'Add' : 'Update'} selected ${
        numberOfSelectedRecords ?? ''
      } ${pluralRepName}`,
      className: styles.label_width
    },
    {
      value: BulkMode.TotalRecords,
      children: `${
        actionType === actions.addToList ? 'Add' : 'Select'
      } all ${totalRecords} ${pluralRepName} across ${totalPages} pages`,
      className: classNames(styles.total_leads_radio, styles.label_width)
    },
    settingConfig?.EnableNLeadsFeature === '1'
      ? {
          value: BulkMode.NLeads,
          children: (
            <NLead
              disabled={bulkSelectionMode?.mode !== BulkMode.NLeads}
              setBulkSelectionMode={setBulkSelectionMode}
              bulkSelectionMode={bulkSelectionMode}
              settingConfig={settingConfig}
              pluralRepName={pluralRepName}
              error={error}
            />
          ),
          className: classNames(styles.n_lead_radio, styles.label_width)
        }
      : null
  ];

  return (
    <>
      {isSelectAll ? (
        <div className={styles.wrapper}>
          {optionsConfig?.map((option) => {
            return (
              <div key={option?.value} className={option?.className}>
                <RadioButton
                  radioGroup="bulk-selection-mode"
                  value={option?.value as string}
                  onChange={handleChange}
                  checked={bulkSelectionMode?.mode === option?.value}>
                  <span
                    title={typeof option?.children == 'string' ? option?.children : ''}
                    className={styles.ellipsis}>
                    {option?.children}
                  </span>
                </RadioButton>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

LeadBulkSelectionMode.defaultProps = {
  actionType: undefined,
  error: undefined
};

export default React.memo(LeadBulkSelectionMode);
