import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import Notes from '../Notes';
import * as notesUtils from '../utils/notes';
import * as users from 'common/component-lib/user-name';
import * as storage from 'common/utils/storage-manager';
import * as utils from '../utils';
import * as restClient from 'common/utils/rest-client';
import { notes } from '../__mocks__/data';
import { DEFAULT_ENTITY_IDS } from '../../../common/constants';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from '../../../common/component-lib/send-email/constants';
import { EntityType } from '../../../common/types';

const observe = jest.fn();
const unobserve = jest.fn();
// Mock the IntersectionObserver
class IntersectionObserverMock {
  observe = observe;
  unobserve = unobserve;
}

jest.mock('common/component-lib/editor/basic-editor/BasicEditor', () => ({ onValueChange }) => {
  onValueChange?.('input');
  return <></>;
});

const mockHoverEvent = (testId) => {
  fireEvent.mouseOver(screen.getByTestId(testId));
};

const mockEntityIds = DEFAULT_ENTITY_IDS;
const mockEntityRepName = DEFAULT_LEAD_REPRESENTATION_NAME;

describe('Notes', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
    window.IntersectionObserver = IntersectionObserverMock as any;
    jest
      .spyOn(notesUtils, 'fetchNotes')
      .mockResolvedValue({ List: notes.slice(1), RecordCount: 1 });
    jest
      .spyOn(storage, 'getItem')
      .mockReturnValue({ User: { Id: '2e56b013-5891-11ea-89f8-0aba07952e1e' } });
    jest
      .spyOn(users, 'getUserNames')
      .mockResolvedValue({ '2e56b013-5891-11ea-89f8-0aba07952e1e': 'Mani' });
    jest.spyOn(utils, 'getNotesFileStorageConfig').mockImplementation(jest.fn());
  });

  // it('Should render default notes page when note are not available', async () => {
  //   // Arrange
  //   jest.spyOn(notesUtils, 'fetchNotes').mockResolvedValue({ List: [], RecordCount: 0 });
  //   const { queryByTestId } = render(<Notes />);

  //   // Assert
  //   await waitFor(() => {
  //     expect(queryByTestId('default-page-add-notes')).toBeInTheDocument();
  //   });
  // });

  it('Should render notes timeline when notes are available', async () => {
    // Arrange
    const { queryByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Assert
    await waitFor(() => {
      expect(queryByTestId('default-page-add-notes')).not.toBeInTheDocument();
      expect(queryByTestId('timeline-group')).toBeInTheDocument();
    });
  });

  // --> Need to uncomment later
  // it('Should show Edit and Delete Actions on hover when user is owner of note', async () => {
  //   // Arrange
  //   const { queryByTestId } = render(<Notes />);

  //   // Act
  //   await waitFor(() => {
  //     mockHoverEvent('timeline');
  //   });

  //   // Assert
  //   await waitFor(() => {
  //     expect(queryByTestId('notes-action-edit')).toBeInTheDocument();
  //     expect(queryByTestId('notes-action-delete')).toBeInTheDocument();
  //   });
  // });

  // it('Should not show Edit and Delete Actions on hover when user is not owner of note', async () => {
  //   // Arrange
  //   jest
  //     .spyOn(users, 'getUserNames')
  //     .mockResolvedValue({ '2e56b013-5891-11ea-89f8-0aba07952e1e': 'Test User' });
  //   const { queryByTestId } = render(<Notes />);

  //   // Act
  //   await waitFor(() => {
  //     mockHoverEvent('timeline');
  //   });

  //   // Assert
  //   await waitFor(() => {
  //     expect(queryByTestId('notes-action-edit')).not.toBeInTheDocument();
  //     expect(queryByTestId('notes-action-delete')).not.toBeInTheDocument();
  //   });
  // });

  it('Should open notes modal on click of edit button', async () => {
    // Arrange
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-edit'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Edit Notes')).toBeInTheDocument();
    });
  });

  it('Should open delete notes modal on click of delete button', async () => {
    // Arrange
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-delete'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Delete Notes')).toBeInTheDocument();
    });
  });

  it('Should delete notes on confirmation when notes delete modal is open', async () => {
    // Arrange
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );
    jest.spyOn(utils, 'deleteNotes').mockImplementation(jest.fn());

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-delete'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('yes-delete-notes'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText(notes[0].Note)).not.toBeInTheDocument();
    });
  });

  it('Should open notes modal on click of edit with file preview when note has attachment', async () => {
    // Arrange
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-edit'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId('file-wrapper')).toBeInTheDocument();
    });
  });

  it('Should open notes modal on click of edit without file preview when note has no attachment', async () => {
    // Arrange
    jest
      .spyOn(notesUtils, 'fetchNotes')
      .mockResolvedValue({ List: notes.slice(0, 1), RecordCount: 1 });
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-edit'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Add Attachment')).toBeInTheDocument();
    });
  });

  it('Should remove file when file upload is cleared', async () => {
    // Arrange
    const fileDeleteMock = jest.fn();
    const updateNotesMock = jest.fn();
    jest.spyOn(utils, 'handleFileDelete').mockImplementation(fileDeleteMock);
    jest.spyOn(utils, 'updateNotes').mockImplementation(updateNotesMock);
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-edit'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('delete-file-icon'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('yes-delete-file'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Add Attachment')).toBeInTheDocument();
      expect(fileDeleteMock).toHaveBeenCalledTimes(1);
      expect(updateNotesMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(notes[1].AttachmentName)).not.toBeInTheDocument();
    });
  });

  it('Should show preview on click of attachment after notes modal is open', async () => {
    // Arrange
    jest.spyOn(restClient, 'httpPost').mockImplementation(() => Promise.resolve('url1'));
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-edit'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('file-preview-box'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('No Preview Available')).toBeInTheDocument();
    });
  });

  // it('Should show preview on click of timeline attachment', async () => {
  //   // Arrange
  //   jest.spyOn(utils, 'getPresignedUrl').mockImplementation(() => Promise.resolve('url1'));
  //   const { getByTestId } = render(<Notes />);

  //   // Act
  //   await waitFor(() => {
  //     fireEvent.click(getByTestId('note-file-attachment'));
  //   });

  //   // Assert
  //   await waitFor(() => {
  //     expect(screen.queryByText('No Preview Available')).toBeInTheDocument();
  //   });
  // });

  it('Should update notes when save button is clicked in edit case', async () => {
    // Arrange
    const updateMock = jest.fn();
    jest.spyOn(utils, 'updateNotes').mockImplementation(updateMock);
    const { getByTestId } = render(
      <Notes
        getData={() => {
          return {
            entityIds: mockEntityIds,
            entityRepName: mockEntityRepName,
            entityType: EntityType.Lead
          };
        }}
      />
    );

    // Act
    await waitFor(() => {
      mockHoverEvent('timeline');
      fireEvent.click(getByTestId('notes-action-edit'));
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('add-notes-save'));
    });

    // Assert
    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});
