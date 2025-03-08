import Badge from '@lsq/nextgen-preact/v2/badge';
import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import styles from '../filter-renderer.module.css';

export const addBadgeComponent = (options: IOption[], isNeutral?: boolean): IOption[] => {
  return options.map((option) => {
    return {
      ...option,
      customComponent: (
        <Badge
          customStyleClass={styles.badge_option}
          size="sm"
          status={isNeutral ? 'neutral' : (option.value?.toLowerCase() as BadgeStatus)}>
          {option.label}
        </Badge>
      )
    };
  });
};
