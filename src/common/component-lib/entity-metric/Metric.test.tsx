import { render, screen } from '@testing-library/react';
import Metric from './Metric';

//Arrange
const metricsDummyData = [
  {
    id: 'Score',
    name: 'Lead Score',
    schemaName: 'Score',
    colSpan: '1',
    value: '95'
  },
  {
    id: 'Revenue',
    name: 'Order Value',
    schemaName: 'Revenue',
    colSpan: '2',
    value: ''
  }
];

describe('Metric', () => {
  it('Should render shimmer when loading is true', () => {
    //Arrange
    render(<Metric isLoading={true} data={[]} />);

    //Act
    const shimmerElements = screen.getAllByTestId('shimmer');

    // Assert
    expect(shimmerElements.length).toBeGreaterThan(0);
  });

  it('Should render metrics when data is available', () => {
    //Arrange
    render(<Metric isLoading={false} data={metricsDummyData} />);

    //Act
    const metricNameElement = screen.getByText('Lead Score');
    const metricValueElement = screen.getByText('95');

    //Assert
    expect(metricNameElement).toBeInTheDocument();
    expect(metricValueElement).toBeInTheDocument();
  });

  it('Should render hyphen (“-“) when metric name or value is not available', () => {
    //Arrange
    const dataWithMissingValues = [
      {
        id: 'Score',
        name: '',
        value: 'score',
        schemaName: 'Score',
        colSpan: '1'
      }
    ];
    render(<Metric isLoading={false} data={dataWithMissingValues} />);

    //Act
    const metricNameElement = screen.getByText('-');

    //Assert
    expect(metricNameElement).toBeInTheDocument();
  });
});
