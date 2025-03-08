import { IActivityCategoryMetadata } from 'apps/activity-history/types/category-metadata.types';
import styles from './manage-activity-tab.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import { useState } from 'react';
import { ArrowDown } from 'assets/custom-icon/v2';
import { useLocation } from 'wouter';
import { PanelItem } from '@lsq/nextgen-preact/panel';
import { ActivityTypeIcon } from 'common/component-lib/activity-type-icon/ActivityTypeIcon';
import Pin from 'assets/custom-icon/Pin';

const ActivitySection = ({
  title,
  activities,
  handlePinToggle,
  selectedActivity,
  isPinned
}: {
  title: string;
  activities: IActivityCategoryMetadata[];
  handlePinToggle: (activity: IActivityCategoryMetadata) => void;
  selectedActivity: string;
  isPinned: boolean;
}): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [, setLocation] = useLocation();

  return (
    // Header
    <div className={isPinned ? styles.pinned_container : styles.unpinned_container}>
      <div
        className={styles.header}
        onClick={(): void => {
          setOpen(!open);
        }}>
        <span className={classNames(styles.sub_title, 'ng_p_1_b')}>
          {title} <span className={styles.counter}>{activities.length}</span>
        </span>
        <span className={styles.collapse}>
          <ArrowDown
            type="outline"
            className={classNames(styles.icon, open ? styles.arrow_up : '')}
          />
        </span>
      </div>

      {/* Activity Items  */}
      {open
        ? activities.map((activity) => {
            const isSelected = selectedActivity === activity.Value;

            return (
              <PanelItem
                key={activity.Value}
                contentStyles={classNames(styles.activity_item, 'ng_p_1_r')}>
                <div
                  className={
                    isSelected
                      ? classNames(styles.activity_wrapper, 'ng_p_1_b')
                      : styles.activity_wrapper
                  }
                  onClick={() => {
                    setLocation(`${window.location.pathname}?ec=${activity.Value}`);
                  }}>
                  <span className={styles.icon_wrapper}>
                    <ActivityTypeIcon
                      value={activity.Value}
                      eventType={activity.EventType}
                      iconType={isSelected ? 'filled' : 'outline'}
                      eventDirection={activity.EventDirection}
                      customStyleClass={
                        isSelected ? styles.selected_activity : styles.activity_test
                      }
                    />
                  </span>

                  <label className={styles.activity_text} title={activity.Text}>
                    {activity.Text}
                  </label>

                  <span
                    className={isPinned ? styles.pin_icon : styles.unpin_icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinToggle(activity);
                    }}>
                    <Pin type={isPinned ? 'filled' : 'outline'} />
                  </span>
                </div>
              </PanelItem>
            );
          })
        : null}
    </div>
  );
};
export default ActivitySection;
