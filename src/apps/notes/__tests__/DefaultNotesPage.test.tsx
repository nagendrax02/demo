import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DefaultNotesPage } from '../components';
import * as utils from '../utils';
import { DEFAULT_ENTITY_IDS } from '../../../common/constants';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from '../../../common/component-lib/send-email/constants';

jest.mock('common/component-lib/editor/basic-editor/BasicEditor', () => ({ onValueChange }) => {
  onValueChange?.('input');
  return <></>;
});

describe('Default Notes Page', () => {
  it('Should open notes modal when add notes button is clicked', async () => {
    // Arrange
    jest.spyOn(utils, 'getNotesFileStorageConfig').mockImplementation(jest.fn());
    const { getByTestId } = render(
      <DefaultNotesPage
        entityIds={DEFAULT_ENTITY_IDS}
        entityRepName={DEFAULT_LEAD_REPRESENTATION_NAME}
      />
    );

    // Act
    await waitFor(() => {
      fireEvent.click(getByTestId('default-page-add-notes'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).toBeInTheDocument();
    });
  });

  it('Should save notes when save button is clicked in create case', async () => {
    // Arrange
    const saveMock = jest.fn();
    jest.spyOn(utils, 'saveNotes').mockImplementation(saveMock);
    jest.spyOn(utils, 'getNotesFileStorageConfig').mockImplementation(jest.fn());
    const { getByTestId } = render(
      <DefaultNotesPage
        entityIds={DEFAULT_ENTITY_IDS}
        entityRepName={DEFAULT_LEAD_REPRESENTATION_NAME}
      />
    );

    // Act
    await waitFor(() => {
      fireEvent.click(getByTestId('default-page-add-notes'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('add-notes-save'));
    });

    // Assert
    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});
