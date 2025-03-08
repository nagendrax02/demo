import { render, screen, waitFor } from '@testing-library/react';
import StatusChange from './StatusChange';
import TooltipContent from './TooltipContent';

describe('StatusChange component', () => {
  const props = {
    auditData: { OldValue: 'Initial', NewValue: 'Updated', ChangedBy: 'user' },
    fieldDisplayName: 'Status',
    oldAdditionalValue: '',
    newAdditionalValue: '',
    activityName: 'StatusChange',
    changedById: 'user-id'
  };

  it('Should render StatusChange component', async () => {
    // Act
    render(<StatusChange {...props} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('status-change')).toBeInTheDocument();
    });
  });

  it('Should render different content based on OldValue and NewValue', async () => {
    // Act
    render(<StatusChange {...props} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Initial')).toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  it('Should handle StatusChange activity name', async () => {
    // Act
    render(<StatusChange {...props} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Initial')).toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  it('Should handle isCfsStatus true and isCFSPrimaryValueSame false', async () => {
    // Arrange
    props.oldAdditionalValue = JSON.stringify([{ DisplayName: 'Stage', Value: 'Stage 1' }]);
    props.newAdditionalValue = JSON.stringify([{ DisplayName: 'State', Value: 'Stage 2' }]);

    // Act
    render(<StatusChange {...props} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Initial')).toBeInTheDocument();
    });
  });

  it('Should handle isCfsStatus true and isCFSPrimaryValueSame true', async () => {
    // Arrange
    props.oldAdditionalValue = JSON.stringify([{ DisplayName: 'Stage', Value: 'Stage 1' }]);
    props.newAdditionalValue = JSON.stringify([{ DisplayName: 'State', Value: 'Stage 1' }]);

    // Act
    render(<StatusChange {...props} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });
});

describe('TooltipContent component', () => {
  it('Should render TooltipContent component without crashing', () => {
    // Act
    render(<TooltipContent tooltipContent='[{"DisplayName": "Test", "Value": "Value"}]' />);

    // Assert
    expect(screen.getByText('Test:')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('Should not render when tooltipContent is not provided', () => {
    // Act
    render(<TooltipContent tooltipContent={undefined} />);

    // Assert
    expect(screen.queryByTestId('tooltip-content')).toBeNull();
  });

  it('Should not render when tooltipContent is an empty string', () => {
    // Act
    render(<TooltipContent tooltipContent="" />);

    // Assert
    expect(screen.queryByTestId('tooltip-content')).toBeNull();
  });

  it('Should not render when tooltipContent is not a valid JSON string', () => {
    // Act
    render(<TooltipContent tooltipContent="Not a JSON string" />);

    // Assert
    expect(screen.queryByTestId('tooltip-content')).toBeNull();
  });
});
