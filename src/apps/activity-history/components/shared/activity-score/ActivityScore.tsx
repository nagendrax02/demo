import styles from './activity-score.module.css';

export interface IActivityScore {
  activityScore: string;
}

const ActivityScore = ({ activityScore }: IActivityScore): JSX.Element | null => {
  if (!activityScore) return null;

  const score = Number(activityScore);

  const getNumberWithSymbol = (): string | number => {
    if (score > 0) {
      return `+${score}`;
    }
    if (score < 0) {
      return score;
    }
    return '';
  };

  const isPositiveScore = score > 0;

  const className = `${styles.activity_score} ${isPositiveScore ? styles.positive_score : ''}`;

  return score !== 0 ? <div className={className}>{getNumberWithSymbol()}</div> : null;
};

export default ActivityScore;
