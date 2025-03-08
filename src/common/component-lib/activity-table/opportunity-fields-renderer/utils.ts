import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { safeParseJson } from 'common/utils/helpers';
import { IFormData } from './opportunity-fields-renderer.types';

interface ISafeData {
  InvocationSource?: string;
  EntityData?: string;
  RelatedEntityData?: string;
  SubRuleSequenceNo?: string;
  SubRuleExecutionTime?: string;
  SubRuleAdvanceSearchCondition?: string;
}

interface ISubRuleAdvanceSearchCondition {
  Conditions?: string[];
  ConditionOperator?: string;
}

export const augmentOpportunityFormData = (data: string): IFormData | null => {
  try {
    const safeData: ISafeData | null = safeParseJson(data);
    if (!safeData) return null;

    const subRuleAdvanceSearchCondition: ISubRuleAdvanceSearchCondition | null = safeParseJson(
      safeData.SubRuleAdvanceSearchCondition || ''
    );

    return {
      InvocationSource: safeData.InvocationSource || 'Unknown',
      OpportunityFields: safeData.EntityData ? safeParseJson(safeData.EntityData) || [] : [],
      LeadFields: safeData.RelatedEntityData ? safeParseJson(safeData.RelatedEntityData) || [] : [],
      RuleSequenceNo: safeData.SubRuleSequenceNo || '',
      RuleExecutionTime: safeData.SubRuleExecutionTime || '',
      RuleAdvanceSearchCondition: subRuleAdvanceSearchCondition?.Conditions || [],
      ConditionOperator: subRuleAdvanceSearchCondition?.ConditionOperator || ''
    };
  } catch (error) {
    trackError('Failed to augment Opportunity FormData', error);
    return null;
  }
};
