import { render, waitFor } from '@testing-library/react';
import MetaData from '../metadata';
import { DataType, RenderType } from 'common/types/entity/lead';
import Value from '../metadata/Value';

const mockConfig = [
  {
    DataType: DataType.Text,
    RenderType: RenderType.TextArea,
    SchemaName: 'test1',
    DisplayName: 'test 1',
    Value: 'sampleTestarea'
  },
  {
    DataType: DataType.Text,
    RenderType: RenderType.URL,
    SchemaName: 'test2',
    DisplayName: 'test 2',
    Value: 'sampleUrl'
  },
  {
    DataType: DataType.Text,
    RenderType: RenderType.Phone,
    SchemaName: 'test3',
    DisplayName: 'test 3',
    Value: '1234567890'
  },
  {
    DataType: DataType.Text,
    RenderType: RenderType.Email,
    SchemaName: 'test4',
    DisplayName: 'test 4',
    Value: 'sample@email.com'
  },
  {
    DataType: DataType.Text,
    RenderType: RenderType.Currency,
    SchemaName: 'test5',
    DisplayName: 'test 5',
    Value: 'sampleDefault'
  }
];

describe('MetaData', () => {
  it('Should render nothing when config is undefined', () => {
    // Act
    const { container } = render(<MetaData isLoading={false} config={undefined} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('Should render metadata fields when valid config is passed', async () => {
    // Act
    const { getByText } = render(<MetaData isLoading={false} config={mockConfig} />);

    // Assert
    await waitFor(() => {
      expect(getByText('1234567890')).toBeInTheDocument();
      expect(getByText('sampleUrl')).toBeInTheDocument();
    });
  });
});

describe('Value', () => {
  it('Should render TextArea type', () => {
    // Act
    const { getByText } = render(<Value field={mockConfig[0]} />);

    // Assert
    expect(getByText('sampleTestarea')).toBeInTheDocument();
  });

  it('Should render URL type', () => {
    // Act
    const { getByText } = render(<Value field={mockConfig[1]} />);

    // Assert
    expect(getByText('sampleUrl')).toBeInTheDocument();
  });

  it('Should render Phone type', () => {
    // Act
    const { getByText } = render(<Value field={mockConfig[2]} />);

    // Assert
    expect(getByText('1234567890')).toBeInTheDocument();
  });

  it('Should render Email type', () => {
    // Act
    const { getByText } = render(<Value field={mockConfig[3]} />);

    // Assert
    expect(getByText('sample@email.com')).toBeInTheDocument();
  });

  it('Should render default type', () => {
    // Act
    const { getByText } = render(<Value field={mockConfig[4]} />);

    // Assert
    expect(getByText('sampleDefault')).toBeInTheDocument();
  });
});
