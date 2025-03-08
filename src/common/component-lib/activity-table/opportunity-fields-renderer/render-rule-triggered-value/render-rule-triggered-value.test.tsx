import { render, waitFor } from '@testing-library/react';
import renderRuleTriggeredValue from './render-rule-triggered-value';
import RuleCondition from './RuleCondition';

const executionTime = '2023-01-01T12:00:00';

jest.mock('common/utils/date', () => ({
  getFormattedDateTime: jest.fn(() => executionTime)
}));

describe('renderRuleTriggeredValue Component', () => {
  it('Should render renderRuleTriggeredValue Component', async () => {
    // Arrange
    const props = {
      sequenceNo: 1,
      executionTime: executionTime,
      ruleAdvanceSearchCondition: ['condition1', 'condition2'],
      conditionOperator: 'AND'
    };

    // Act
    const { getByText } = render(renderRuleTriggeredValue(props));

    // Assert
    await waitFor(() => {
      expect(getByText(`Rule ${props.sequenceNo}`)).toBeInTheDocument();
      expect(getByText(props.executionTime)).toBeInTheDocument();
      expect(getByText(props.ruleAdvanceSearchCondition[0])).toBeInTheDocument();
      expect(getByText(props.ruleAdvanceSearchCondition[1])).toBeInTheDocument();
    });
  });

  it('Should render when ruleAdvanceSearchCondition is empty array', () => {
    // A
    const props = {
      sequenceNo: 1,
      executionTime: executionTime,
      ruleAdvanceSearchCondition: [],
      conditionOperator: 'AND'
    };

    const { getByText, queryByTestId } = render(renderRuleTriggeredValue(props));

    expect(getByText(`Rule ${props.sequenceNo}`)).toBeInTheDocument();
    expect(getByText(props.executionTime)).toBeInTheDocument();
    expect(queryByTestId('rule-advance-search-condition-container')).toBeNull();
  });
});

describe('RuleCondition Component', () => {
  test('Should render with purified content', async () => {
    const props = {
      condition: '<span>Test Condition</span>',
      index: 1,
      conditionOperator: 'AND'
    };

    const { getByText } = render(<RuleCondition {...props} />);

    await waitFor(() => {
      expect(getByText('Test Condition')).toBeInTheDocument();
    });
  });

  it('Should not render condition when getPurifiedContent return empty', async () => {
    // Arrange
    const props = {
      condition: 'Test Condition',
      index: 1,
      conditionOperator: 'AND'
    };

    jest.mock('common/utils/helpers', () => ({
      ...jest.requireActual('common/utils/helpers'),
      getPurifiedContent: jest.fn().mockRejectedValue(new Error('Mocked error'))
    }));

    // Act
    const { queryByText } = render(<RuleCondition {...props} />);

    // Assert
    await waitFor(() => {
      expect(queryByText('AND')).not.toBeInTheDocument();
      expect(queryByText('Test Condition')).not.toBeInTheDocument();
    });
  });

  it('Should render condition with conditionOperator when index is equal to 1', async () => {
    // Arrange
    const props = {
      condition: '<span>Test Condition<span>',
      index: 1,
      conditionOperator: 'OR'
    };

    // Act
    const { getByText } = render(<RuleCondition {...props} />);

    // Assert
    await waitFor(() => {
      expect(getByText('OR')).toBeInTheDocument();
      expect(getByText('Test Condition')).toBeInTheDocument();
    });
  });

  it('Should not render conditionOperator when index not equal to 1', async () => {
    // Arrange
    const props = {
      condition: 'Test Condition',
      index: 2,
      conditionOperator: 'OR'
    };

    // Act
    const { getByText, queryByText } = render(<RuleCondition {...props} />);

    // Assert
    await waitFor(() => {
      expect(queryByText('OR')).not.toBeInTheDocument();
      expect(getByText('Test Condition')).toBeInTheDocument();
    });
  });
});
