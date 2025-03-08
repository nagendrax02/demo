import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IFormData, IOpportunityFieldsRenderer } from './opportunity-fields-renderer.types';
import renderRuleTriggeredValue from './render-rule-triggered-value';
import renderFields from './render-fields';

const opportunityFieldsRenderer = (
  formData: IFormData,
  leadRepresentationName?: IEntityRepresentationName
): IOpportunityFieldsRenderer[] => {
  const fieldsData = [
    {
      DisplayName: 'Innvocation',
      Value: formData.InvocationSource,
      DataType: 'String',
      ShowInForm: true
    },
    {
      DisplayName: `${leadRepresentationName?.SingularName || 'Lead'} Fields`,
      Value: renderFields(formData.LeadFields),
      DataType: 'String',
      ShowInForm: true
    },
    {
      DisplayName: 'Opportunity Fields',
      Value: renderFields(formData.OpportunityFields),
      DataType: 'String',
      ShowInForm: true
    }
  ];

  if (
    formData.RuleSequenceNo ||
    formData.RuleExecutionTime ||
    (formData.RuleAdvanceSearchCondition.length && formData.ConditionOperator)
  ) {
    const ruleTriggeredValue = renderRuleTriggeredValue({
      sequenceNo: formData.RuleSequenceNo,
      executionTime: formData.RuleExecutionTime,
      ruleAdvanceSearchCondition: formData.RuleAdvanceSearchCondition,
      conditionOperator: formData.ConditionOperator
    });

    fieldsData.push({
      DisplayName: 'Duplicate Detection - Rule Triggered',
      Value: ruleTriggeredValue as JSX.Element,
      DataType: 'String',
      ShowInForm: true
    });
  }

  return fieldsData;
};

export default opportunityFieldsRenderer;
