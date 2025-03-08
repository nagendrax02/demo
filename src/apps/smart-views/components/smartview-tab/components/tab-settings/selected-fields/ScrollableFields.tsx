import SortableList from 'common/component-lib/sortable-list';
import styles from './selected-fields.module.css';
import { IAvailableField } from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { classNames } from 'common/utils/helpers/helpers';

interface IScrollableFields {
  fields: IAvailableField[];
  badgeText?: string;
  title?: string;
  onChange: (newFields: IAvailableField[]) => void;
  onRemove: (id: string, removeCallback: () => void, newFields: IAvailableField) => void;
  onPin?: (item: IAvailableField, isPinned: boolean) => void;
  customStyleClass?: string;
  maxLimitReached?: boolean;
}

const ScrollableFields = (props: IScrollableFields): JSX.Element => {
  const {
    fields,
    onChange,
    onRemove,
    onPin,
    badgeText,
    title,
    customStyleClass,
    maxLimitReached = false
  } = props;
  return (
    <>
      {title ? (
        <div className={styles.scrollable_list_title_wrapper}>
          <div className={classNames(styles.scrollable_list_title, 'ng_p_1_m', 'ng_v2_style')}>
            {title}
          </div>
          {badgeText ? (
            <Badge size="sm" status={maxLimitReached ? 'failed' : 'neutral'} type="regular">
              {badgeText}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <SortableList
        sortableList={fields}
        onChange={onChange}
        onRemove={onRemove}
        onPin={onPin}
        customStyleClass={customStyleClass}
      />
    </>
  );
};

ScrollableFields.defaultProps = {
  badgeText: undefined,
  title: undefined
};

export default ScrollableFields;
