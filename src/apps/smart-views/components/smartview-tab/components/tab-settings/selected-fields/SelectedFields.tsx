import { useSelectedFields, useTabSettingsActions } from '../tab-settings.store';
import styles from './selected-fields.module.css';
import { IAvailableField } from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { getPinnedFields } from './utils';
import { classNames } from 'common/utils/helpers/helpers';
import ScrollableFields from './ScrollableFields';
import { MAX_PINNED_COLUMN_LIMIT } from './constants';

interface ISelectedFields {
  title: string;
  description: string;
  warningMessage: string;
  selectedAction: IMenuItem | null;
}

const SelectedFields = (props: ISelectedFields): JSX.Element => {
  const { title, description, warningMessage, selectedAction } = props;
  const { setSelectedFields, updateSelectedFields, deselectField, updatePinnedFields } =
    useTabSettingsActions();
  const selectedFields = useSelectedFields();

  const { pinnedFields, scrollableFields } = getPinnedFields(selectedFields);

  const handlePinnedField = (field: IAvailableField, isPinned: boolean): void => {
    const updatedField: IAvailableField = {
      ...field,
      columnConfigData: {
        ...field?.columnConfigData,
        pinnedColumnConfig: {
          showPinAction: field?.columnConfigData?.pinnedColumnConfig?.showPinAction ?? true,
          canUnpin: field?.columnConfigData?.pinnedColumnConfig?.canUnpin ?? true,
          isPinned: isPinned
        }
      }
    };
    if (!isPinned || (isPinned && pinnedFields?.length < MAX_PINNED_COLUMN_LIMIT)) {
      updatePinnedFields(updatedField);
    }
  };

  const getScrollableList = (): JSX.Element => {
    if (selectedAction?.value === HeaderAction?.ExportLeads) {
      return (
        <ScrollableFields
          fields={selectedFields}
          onChange={(reOrderedSelectedFields: IAvailableField[]) => {
            setSelectedFields(reOrderedSelectedFields);
          }}
          onRemove={(id: string, rmCb, selectedField: IAvailableField) => {
            updateSelectedFields(selectedField);
            deselectField(selectedField);
          }}
          customStyleClass={classNames(styles.scrollable_list_base, styles.is_only_child)}
        />
      );
    }
    return (
      <>
        <ScrollableFields
          title="Pinned Columns"
          badgeText={`${pinnedFields?.length}/${MAX_PINNED_COLUMN_LIMIT}`}
          fields={pinnedFields}
          onChange={(reOrderedSelectedFields: IAvailableField[]) => {
            setSelectedFields([...reOrderedSelectedFields, ...scrollableFields]);
          }}
          onRemove={(id: string, rmCb, selectedField: IAvailableField) => {
            if (selectedField?.columnConfigData?.pinnedColumnConfig?.canUnpin) {
              updateSelectedFields(selectedField);
              deselectField(selectedField);
            }
          }}
          customStyleClass={classNames(styles.scrollable_list_base)}
          onPin={handlePinnedField}
          maxLimitReached={pinnedFields?.length >= MAX_PINNED_COLUMN_LIMIT}
        />
        <ScrollableFields
          title="Scrollable Columns"
          fields={scrollableFields}
          onChange={(reOrderedSelectedFields: IAvailableField[]) => {
            setSelectedFields([...pinnedFields, ...reOrderedSelectedFields]);
          }}
          onRemove={(id: string, rmCb, selectedField: IAvailableField) => {
            if (selectedField?.columnConfigData?.pinnedColumnConfig?.canUnpin) {
              updateSelectedFields(selectedField);
              deselectField(selectedField);
            }
          }}
          customStyleClass={classNames(styles.scrollable_list_base, styles.is_last_child)}
          onPin={handlePinnedField}
        />
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.title, 'ng_h_5_b', 'ng_v2_style')}>{title}</div>
      {description ? <div className={styles.description}>{description}</div> : null}
      {selectedAction?.value === HeaderAction.ExportLeads && !selectedFields?.length ? (
        <div className={styles.no_result_found}>No result found</div>
      ) : (
        <div
          className={classNames(
            styles.scrollable_list_wrapper,
            'ng_scrollbar',
            styles.selected_fields
          )}>
          {getScrollableList()}
        </div>
      )}

      {warningMessage ? <div className={styles.warning_message}>{warningMessage}</div> : null}
    </div>
  );
};

export default SelectedFields;
