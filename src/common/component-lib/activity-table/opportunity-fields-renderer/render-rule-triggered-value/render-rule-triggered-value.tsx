import { getFormattedDateTime } from 'common/utils/date';
import RuleCondition from './RuleCondition';
import styles from '../opportunity-fields-renderer.module.css';

export interface IRenderRuleTriggeredValue {
  sequenceNo: string | number;
  executionTime: string;
  ruleAdvanceSearchCondition: string[];
  conditionOperator: string;
}

const renderRuleTriggeredValue = ({
  sequenceNo,
  executionTime,
  ruleAdvanceSearchCondition,
  conditionOperator
}: IRenderRuleTriggeredValue): JSX.Element => {
  const formatDate = getFormattedDateTime({ date: executionTime });

  return (
    <>
      {sequenceNo || executionTime ? (
        <div className={styles.rule_triggered_container}>
          <div>Rule {sequenceNo}</div>
          <div>
            <span>{formatDate}</span>
          </div>
        </div>
      ) : null}
      {ruleAdvanceSearchCondition?.length ? (
        <div
          className={styles.rule_advance_search_condition_container}
          data-testid="rule-advance-search-condition-container">
          {ruleAdvanceSearchCondition.map((condition, index) => {
            return (
              <RuleCondition
                key={`${condition}-index`}
                condition={condition as string}
                index={index}
                conditionOperator={conditionOperator}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default renderRuleTriggeredValue;
