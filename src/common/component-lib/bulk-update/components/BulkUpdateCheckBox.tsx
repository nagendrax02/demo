import Checkbox from '@lsq/nextgen-preact/checkbox';
import { useBulkUpdate } from '../bulk-update.store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import styles from './component.module.css';
import { IBulkUpdateField } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

const BulkUpdateCheckBox = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const updatedTo = useBulkUpdate((state) => state.updatedTo);

  const handleSelection = (checked: boolean): void => {
    setUpdateTo({ value: checked ? '1' : '0', comment: updatedTo.comment as string });
  };

  const handleComment = (value: string): void => {
    setUpdateTo({ value: updatedTo?.value, comment: value });
  };

  return (
    <div>
      <Checkbox checked={updatedTo?.value === '1'} changeSelection={handleSelection} />
      {field?.showCommentBox ? (
        <div className={styles.checkbox_comment_text_area}>
          <TextArea
            message={updatedTo?.comment as string}
            handleMessageChange={(e) => {
              handleComment(e?.target?.value);
            }}
            placeholder={'Comments'}
            maxLength={5000}
            suspenseFallback={<Shimmer height="32px" width="100%" />}
          />
          <div className={styles.checkbox_comment}>
            Provide comments for{' '}
            <span className={styles.checkbox_comment_field_display_name}>{field?.label}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BulkUpdateCheckBox;
