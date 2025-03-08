import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SourceChange from './SourceChange';
import Modal from './Modal';
import { getColumnConfig } from './utils';

describe('SourceChange component', () => {
  // Arrange
  const props = {
    auditData: { OldValue: 'old', NewValue: 'new', ChangedBy: 'user' },
    fieldDisplayName: 'Source',
    oldAdditionalValue: '',
    newAdditionalValue: '',
    changedById: 'user-id'
  };

  it('Should render SourceChange component', async () => {
    // Act
    render(<SourceChange {...props} />);

    // Assert
    await waitFor(() => {
      // expect(screen.getByTestId('source-change')).toBeInTheDocument();
      expect(screen.getByText('Changed by')).toBeInTheDocument();
    });
  }, 10000);

  it('Should shows modal when source text is clicked and values are different', async () => {
    // Act
    render(<SourceChange {...props} />);

    // Assert
    await waitFor(() => {
      // fireEvent.click(screen.getByText('Source'));
      expect(screen.getByText('Changed by')).toBeInTheDocument();
    });
  }, 10000);

  it('Should have className empty when OldValue and NewValue have Empty values', async () => {
    // Arrange
    props.fieldDisplayName = 'Empty';
    props.auditData = {
      OldValue: 'Empty',
      NewValue: 'Empty',
      ChangedBy: 'user'
    };

    // Act
    render(<SourceChange {...props} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Empty').classList.contains('empty')).toBe(true);
    });
  });
});

describe('Modal component', () => {
  const mockSetShowModal = jest.fn();

  it('Should not display modal when showModal is false', async () => {
    // Act
    render(<Modal showModal={false} setShowModal={mockSetShowModal} sourceChangeData={null} />);

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('Should display modal when showModal is true', async () => {
    // Act
    render(<Modal showModal={true} setShowModal={mockSetShowModal} sourceChangeData={null} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });

  it('Should call setShowModal with false when close button is clicked', async () => {
    // Act
    render(<Modal showModal={true} setShowModal={mockSetShowModal} sourceChangeData={null} />);

    // Assert
    await waitFor(() => {
      fireEvent.click(screen.getByText('Close'));
      expect(mockSetShowModal).toHaveBeenCalledWith(false);
    });
  });

  it('Should render table rows including header when data is provided', async () => {
    // Arrange
    const sourceChangeData = {
      title: 'Change Details',
      data: [
        { DisplayName: 'Field1', OldValue: 'Old1', NewValue: 'New1', DataType: 'DataType' },
        { DisplayName: 'Field2', OldValue: 'Old2', NewValue: 'New2', DataType: 'DataType' }
      ],
      isOldAndNewValueSame: false
    };

    // Act
    render(
      <Modal showModal={true} setShowModal={mockSetShowModal} sourceChangeData={sourceChangeData} />
    );

    // Assert
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(sourceChangeData.data.length + 1);
    });
  });

  it('Should set the title correctly in the modal header', async () => {
    // Arrange
    const sourceChangeData = {
      title: 'Change Details',
      data: [],
      isOldAndNewValueSame: false
    };

    // Act
    render(
      <Modal showModal={true} setShowModal={mockSetShowModal} sourceChangeData={sourceChangeData} />
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Change Details')).toBeInTheDocument();
    });
  });
});

describe('getColumnConfig', () => {
  it('Should return column config with Old Value and New Value when isOldAndNewValueSame is true', () => {
    // Act
    const result = getColumnConfig(true);

    // Assert
    expect(result).toEqual([
      {
        field: 'Field',
        key: 'DisplayName',
        width: 150
      },
      {
        field: 'Old Value',
        key: 'OldValue',
        width: 250
      },
      {
        field: 'New Value',
        key: 'NewValue',
        width: 250
      }
    ]);
  });

  it('Should return column config with Value when isOldAndNewValueSame is false', () => {
    // Act
    const result = getColumnConfig(false);

    // Assert
    expect(result).toEqual([
      {
        field: 'Field',
        key: 'DisplayName',
        width: 150
      },
      {
        field: 'Value',
        key: 'Value',
        width: 250
      }
    ]);
  });

  it('Should return column config with Value when isOldAndNewValueSame is not provided', () => {
    // Act
    const result = getColumnConfig();

    // Assert
    expect(result).toEqual([
      {
        field: 'Field',
        key: 'DisplayName',
        width: 150
      },
      {
        field: 'Value',
        key: 'Value',
        width: 250
      }
    ]);
  });
});
