import styles from './tab-settings.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ExportType } from './tab-settings.types';
import useTabSettingsStore, { useSelectedFields } from './tab-settings.store';
import { TabType } from 'apps/smart-views/constants/constants';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getEntityRepName } from './utils-helper';
import { classNames } from 'common/utils/helpers/helpers';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

const RadioButton = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/radio')));

interface ISelectExportType {
  tabType: TabType;
  entityRepName: IEntityRepresentationName;
}

const SelectExportType = (props: ISelectExportType): JSX.Element => {
  const { tabType, entityRepName } = props;
  const { selectedExportType } = useTabSettingsStore();
  const { setSelectedExportType } = useTabSettingsStore().actions;

  const onChange = (value): void => {
    setSelectedExportType(value);
  };
  const selectedFields = useSelectedFields();

  const generateTooltipContent = (): string => {
    return `All ${
      entityRepName?.SingularName || getEntityRepName(tabType)
    } fields + Few Lead Identifier fields`;
  };

  const showToolTip = (): boolean => {
    return tabType !== TabType.Lead && tabType !== TabType.Account;
  };

  return (
    <>
      <div
        className={classNames(
          styles.body_container,
          selectedExportType === ExportType.AllFields ? styles.hide_border : null
        )}>
        <span className={styles.name}>Export </span>
        <div className={styles.radio}>
          <div className={styles.radio_button_with_info}>
            <RadioButton
              radioGroup="entity-export"
              value={ExportType.AllFields}
              onChange={onChange}
              suspenseFallback={<Shimmer height="16px" width="16px" />}
              checked={selectedExportType === ExportType.AllFields}>
              All Fields
            </RadioButton>
            {showToolTip() ? (
              <Tooltip
                content={generateTooltipContent()}
                placement={Placement.Horizontal}
                trigger={[Trigger.Hover]}>
                <Icon name="info" customStyleClass={styles.info_icon} />
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.custom_fields_select}>
            <RadioButton
              radioGroup="entity-export"
              value={ExportType.SelectedFields}
              onChange={onChange}
              suspenseFallback={<Shimmer height="16px" width="16px" />}
              checked={selectedExportType === ExportType.SelectedFields}>
              Selected Fields
            </RadioButton>
            {selectedExportType === ExportType.SelectedFields ? (
              <div className={styles.field_count}>({selectedFields?.length})</div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectExportType;
