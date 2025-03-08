import { render, screen, waitFor } from '@testing-library/react';
import Assigned from 'src/apps/activity-history/components/opportunity-audit/components/assigned/Assigned';

describe('Assigned Component', () => {
  test('Should renders Assigned Component', async () => {
    // Arrange
    const auditData = {
      OldValue: 'John Doe',
      NewValue: 'Jane Smith',
      ChangedBy: 'Admin'
    };
    const fieldDisplayName = 'Owner';
    const changedById = 'admin-id';

    // Act
    render(
      <Assigned
        auditData={auditData}
        fieldDisplayName={fieldDisplayName}
        changedById={changedById}
      />
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('assigned')).toBeInTheDocument();
    });
  });

  test('Should render with undefined auditData', async () => {
    // Arrange
    const fieldDisplayName = 'Owner';
    const changedById = 'admin-id';

    // Act
    render(
      <Assigned
        auditData={undefined}
        fieldDisplayName={fieldDisplayName}
        changedById={changedById}
      />
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('assigned')).toBeInTheDocument();
      expect(screen.queryByText(`${fieldDisplayName} changed from`)).not.toBeInTheDocument();
    });
  });

  test('Should render with undefined fieldDisplayName', async () => {
    // Arrange
    const auditData = {
      OldValue: 'John Doe',
      NewValue: 'Jane Smith',
      ChangedBy: 'Admin'
    };
    const changedById = 'admin-id';

    // Act
    render(
      <Assigned auditData={auditData} fieldDisplayName={undefined} changedById={changedById} />
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('assigned')).toBeInTheDocument();
      expect(screen.queryByText('changed from')).not.toBeInTheDocument();
    });
  });
});
