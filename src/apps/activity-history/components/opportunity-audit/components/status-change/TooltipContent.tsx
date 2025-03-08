import { safeParseJson } from 'common/utils/helpers';
import styles from '../styles.module.css';
import { IStatusChangeField } from './status-change.types';

interface ITooltipContent {
  tooltipContent: string | undefined;
}

const TooltipContent = (props: ITooltipContent): JSX.Element => {
  const { tooltipContent = '' } = props;

  const data: IStatusChangeField[] | null = safeParseJson(tooltipContent);

  return (
    <div>
      {data?.map((item) => {
        return (
          <div
            key={`${item.DisplayName}-${item.Value}`}
            className={styles.status_wrapper}
            data-testid="tooltip-content">
            <div className={styles.key_wrapper} title={item.DisplayName as string}>
              {item.DisplayName}:
            </div>
            <div className={styles.value_wrapper}>{item.Value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TooltipContent;
