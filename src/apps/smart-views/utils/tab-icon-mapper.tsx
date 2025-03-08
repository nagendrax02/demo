import { classNames } from 'common/utils/helpers/helpers';
import {
  AccountActivity,
  Accounts,
  Custom,
  LeadIcon,
  Mavis,
  Opportunity,
  Task,
  Activity
} from '../../../assets/custom-icon/v2';
import { MAVIS_TAB, TabType } from '../constants/constants';
import styles from '../smartviews.module.css';

const getTabIcon = ({
  tabType,
  customType,
  outlineColor
}: {
  tabType: TabType;
  customType: string;
  outlineColor: string;
}): JSX.Element => {
  const IconMapper = {
    [TabType.Lead]: (
      <LeadIcon type="outline" className={styles.icon} style={{ fill: outlineColor }} />
    ),
    [TabType.Activity]: (
      <Activity type="outline" className={styles.icon} style={{ fill: outlineColor }} />
    ),
    [TabType.AccountActivity]: (
      <AccountActivity type="outline" className={styles.icon} style={{ fill: outlineColor }} />
    ),
    [TabType.Account]: (
      <Accounts type="outline" className={styles.icon} style={{ fill: outlineColor }} />
    ),
    [TabType.Custom]:
      customType === MAVIS_TAB ? (
        <Mavis type="outline" className={styles.icon} style={{ fill: outlineColor }} />
      ) : (
        <Custom type="outline" className={styles.icon} style={{ fill: outlineColor }} />
      ),
    [TabType.Task]: <Task type="outline" className={styles.icon} style={{ fill: outlineColor }} />,
    [TabType.Opportunity]: (
      <Opportunity type="outline" className={styles.icon} style={{ fill: outlineColor }} />
    )
  };

  return IconMapper[tabType] as JSX.Element;
};

const getDuoToneIcon = ({
  tabType,
  customType,
  duoToneColor,
  customStyle = ''
}: {
  tabType: TabType;
  customType?: string;
  duoToneColor: string;
  customStyle?: string;
}): JSX.Element => {
  const IconMapper = {
    [TabType.Lead]: (
      <LeadIcon
        type="duotone"
        className={classNames(styles.duotone_lead_icon, customStyle)}
        style={{ fill: duoToneColor }}
      />
    ),
    [TabType.Activity]: (
      <Activity
        type="duotone"
        className={classNames(styles.icon, customStyle)}
        style={{ fill: duoToneColor }}
      />
    ),
    [TabType.AccountActivity]: (
      <AccountActivity
        type="duotone"
        className={classNames(styles.icon, customStyle)}
        style={{ fill: duoToneColor }}
      />
    ),
    [TabType.Account]: (
      <Accounts
        type="duotone"
        className={classNames(styles.icon, customStyle)}
        style={{ fill: duoToneColor }}
      />
    ),
    [TabType.Custom]:
      customType === MAVIS_TAB ? (
        <Mavis
          type="duotone"
          className={classNames(styles.icon, customStyle)}
          style={{ fill: duoToneColor }}
        />
      ) : (
        <Custom
          type="duotone"
          className={classNames(styles.icon, customStyle)}
          style={{ fill: duoToneColor }}
        />
      ),
    [TabType.Task]: (
      <Task
        type="duotone"
        className={classNames(styles.icon, customStyle)}
        style={{ fill: duoToneColor }}
      />
    ),
    [TabType.Opportunity]: (
      <Opportunity
        type="duotone"
        className={classNames(styles.icon, customStyle)}
        style={{ fill: duoToneColor }}
      />
    )
  };

  return IconMapper[tabType] as JSX.Element;
};

export { getTabIcon, getDuoToneIcon };
