import { render, waitFor } from '@testing-library/react';
import ComponentRenderer, { getComponent } from '../ComponentRenderer';
import { ComponentType, IconContentType } from '../../../types';
import Title from '../title';
import Badge from '../badge';
import Icon from '../icon';
import QuickAction from '../quick-action';
import MetaData from '../metadata';
import { DataType, RenderType } from 'src/common/types/entity/lead';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

const mockComponents = [
  {
    type: ComponentType.Title,
    config: { content: 'Test Title', className: 'testClass' },
    customStyleClass: ''
  },
  { type: ComponentType.Badge, config: { content: 'Test Badge' }, customStyleClass: '' },
  {
    type: ComponentType.Icon,
    config: { contentType: IconContentType.Text, content: 'TS' },
    customStyleClass: ''
  },
  {
    type: ComponentType.QuickAction,
    config: [{ icon: 'star', name: 'action1', onClick: jest.fn() }],
    customStyleClass: ''
  },
  {
    type: ComponentType.Action,
    config: [],
    customStyleClass: ''
  },
  {
    type: ComponentType.MetaData,
    config: [
      {
        DataType: DataType.Text,
        RenderType: RenderType.Textbox,
        SchemaName: 'test1',
        DisplayName: 'test 1',
        Value: 'value1'
      }
    ],
    customStyleClass: ''
  }
];

describe('ComponentRenderer', () => {
  it('Should render icon component when it is present in config', async () => {
    // Act
    const { getByText } = render(
      <ComponentRenderer
        isLoading={false}
        components={mockComponents}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    await waitFor(() => {
      expect(getByText('TS')).toBeInTheDocument();
    });
  });

  it('Should render title component when it is present in config', () => {
    // Act
    const { getByText } = render(
      <ComponentRenderer
        isLoading={false}
        components={mockComponents}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('Should render badge component when it is present in config', () => {
    // Act
    const { getByText } = render(
      <ComponentRenderer
        isLoading={false}
        components={mockComponents}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    expect(getByText('Test Badge')).toBeInTheDocument();
  });

  it('Should render quick action component when it is present in config', () => {
    // Act
    const { getByTestId } = render(
      <ComponentRenderer
        isLoading={false}
        components={mockComponents}
        coreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    // Assert
    expect(getByTestId('quick-action-action1')).toBeInTheDocument();
  });
});

describe('getComponent', () => {
  it('Should return the valid component when type is passed', () => {
    // Act & Assert
    expect(getComponent(ComponentType.Icon)).toBe(Icon);
    expect(getComponent(ComponentType.Title)).toBe(Title);
    expect(getComponent(ComponentType.Badge)).toBe(Badge);
    expect(getComponent(ComponentType.QuickAction)).toBe(QuickAction);
    expect(getComponent(ComponentType.MetaData)).toBe(MetaData);
  });
});
