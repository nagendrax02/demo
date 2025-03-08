import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { getPurifiedContent } from 'common/utils/helpers';
import styles from '../opportunity-fields-renderer.module.css';

interface IRuleCondition {
  condition: string;
  index: number;
  conditionOperator: string;
}

const RuleCondition = ({ condition, index, conditionOperator }: IRuleCondition): JSX.Element => {
  const [purifiedContent, setPurifiedContent] = useState('');

  useEffect(() => {
    const fetchPurifiedContent = async (): Promise<void> => {
      try {
        const content = (await getPurifiedContent(
          index === 1
            ? `<span class="conditional-operator">${conditionOperator}</span> ${condition}`
            : condition
        )) as string;
        setPurifiedContent(content);
      } catch (error) {
        trackError('Failed to get purified content', error);
      }
    };

    fetchPurifiedContent();
  }, [condition, index, conditionOperator]);

  return <div className={styles.rule} dangerouslySetInnerHTML={{ __html: purifiedContent }} />;
};

export default RuleCondition;
