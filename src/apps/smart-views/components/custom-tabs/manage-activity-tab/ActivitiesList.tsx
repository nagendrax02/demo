import { IActivityCategoryMetadata } from 'apps/activity-history/types';
import styles from './manage-activity-tab.module.css';
import ActivitySection from './ActivitySection';

const ActivitiesList = ({
  activities,
  pinnedEventCodes: pinnedActivities,
  handlePinToggle,
  selectedActivity
}: {
  activities: IActivityCategoryMetadata[];
  pinnedEventCodes: Record<string, boolean>;
  handlePinToggle: (activity: IActivityCategoryMetadata) => void;
  selectedActivity: string;
}): JSX.Element => {
  const [Pinnedactivities, Otheractivities] = activities.reduce<
    [IActivityCategoryMetadata[], IActivityCategoryMetadata[]]
  >(
    ([pinned, other], activity) => {
      if (pinnedActivities[activity?.Value]) {
        pinned.push(activity);
      } else {
        other.push(activity);
      }
      return [pinned, other];
    },
    [[], []]
  );
  return (
    <div className={styles.activity_data}>
      <ActivitySection
        title="Pinned Activity Types"
        activities={Pinnedactivities}
        handlePinToggle={handlePinToggle}
        selectedActivity={selectedActivity}
        isPinned
      />
      <ActivitySection
        title="Other Activity Types"
        activities={Otheractivities}
        handlePinToggle={handlePinToggle}
        selectedActivity={selectedActivity}
        isPinned={false}
      />
    </div>
  );
};

export default ActivitiesList;
