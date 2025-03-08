import * as helpers from 'common/utils/helpers';
import opportunityFieldsRenderer from './opportunity-fields-renderer';
import { augmentOpportunityFormData } from './utils';

const fields = {
  SchemaName: 'MockedSchemaName',
  Value: 'MockedValue',
  DisplayName: 'MockedDisplayName',
  Fields: [],
  DataType: 'MockedDataType'
};

// Arrange
const formData = {
  InvocationSource: 'MockedInvocationSource',
  LeadFields: [fields],
  OpportunityFields: [fields],
  RuleSequenceNo: 1,
  RuleExecutionTime: 'MockedExecutionTime',
  RuleAdvanceSearchCondition: ['MockedSearchCondition'],
  ConditionOperator: 'AND'
};

describe('opportunityFieldsRenderer', () => {
  it('Should return an array of opportunity fields data with rule triggered value', () => {
    const result = opportunityFieldsRenderer(formData, {
      SingularName: 'MockedLeadRepresentationName',
      PluralName: ''
    });

    // Assert
    expect(result).toHaveLength(4);
    result.forEach((field) => {
      expect(field).toHaveProperty('DisplayName');
      expect(field).toHaveProperty('Value');
      expect(field).toHaveProperty('DataType');
      expect(field).toHaveProperty('ShowInForm');
    });
    expect(result[0].DisplayName).toBe('Innvocation');
    expect(result[0].Value).toBe(formData.InvocationSource);
    expect(result[1].DisplayName).toBe('MockedLeadRepresentationName Fields');
    expect(result[2].DisplayName).toBe('Opportunity Fields');
    expect(result[3].DisplayName).toBe('Duplicate Detection - Rule Triggered');
  });

  it('Should return an array of opportunity fields data without rule triggered value', () => {
    // Arrange
    formData.RuleSequenceNo = 0;
    formData.RuleExecutionTime = '';
    formData.RuleAdvanceSearchCondition = [];

    // Act
    const result = opportunityFieldsRenderer(formData, {
      SingularName: 'MockedLeadRepresentationName',
      PluralName: ''
    });

    // Assert
    expect(result).toHaveLength(3);
    const ruleTriggeredField = result.find(
      (field) => field.DisplayName === 'Duplicate Detection - Rule Triggered'
    );
    expect(ruleTriggeredField).toBeUndefined();
  });
});

describe('augmentOpportunityFormData', () => {
  const mockSafeData = {
    InvocationSource: 'Test Invocation',
    EntityData: JSON.stringify([{ field: 'value' }]),
    RelatedEntityData: JSON.stringify([{ field: 'value' }]),
    SubRuleSequenceNo: '1',
    SubRuleExecutionTime: '1000',
    SubRuleAdvanceSearchCondition: JSON.stringify({
      Conditions: ['Test Conditions'],
      ConditionOperator: 'Test Operator'
    })
  };

  const mockSubRuleAdvanceSearchCondition = {
    Conditions: ['Test Conditions'],
    ConditionOperator: 'Test Operator'
  };

  it('Should return null if safeParseJson returns null', () => {
    // Act
    jest.spyOn(helpers, 'safeParseJson').mockReturnValueOnce(null);

    // Assert
    expect(augmentOpportunityFormData(JSON.stringify(mockSafeData))).toBeNull();
  });

  it('Should return the correct data if safeParseJson returns valid data', () => {
    // Act & Assert
    expect(augmentOpportunityFormData(JSON.stringify(mockSafeData))).toEqual({
      InvocationSource: mockSafeData.InvocationSource,
      OpportunityFields: JSON.parse(mockSafeData.EntityData!),
      LeadFields: JSON.parse(mockSafeData.RelatedEntityData!),
      RuleSequenceNo: mockSafeData.SubRuleSequenceNo,
      RuleExecutionTime: mockSafeData.SubRuleExecutionTime,
      RuleAdvanceSearchCondition: mockSubRuleAdvanceSearchCondition.Conditions,
      ConditionOperator: mockSubRuleAdvanceSearchCondition.ConditionOperator
    });
  });

  it('Should return null and log an error if an exception is thrown', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(helpers, 'safeParseJson').mockImplementationOnce(() => {
      throw new Error();
    });

    // Act
    expect(augmentOpportunityFormData(JSON.stringify(mockSafeData))).toBeNull();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to augment Opportunity FormData',
      expect.any(Error)
    );
  });
});
