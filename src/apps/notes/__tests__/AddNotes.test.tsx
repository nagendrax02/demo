import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { AddNotes } from '../components';
import * as restClient from 'common/utils/rest-client';
import DefaultNotesPage from '../components/default-notes/DefaultNotesPage';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from 'common/component-lib/send-email/constants';
import { DEFAULT_ENTITY_IDS } from 'common/constants';

jest.mock('common/component-lib/editor/basic-editor/BasicEditor', () => () => {
  return <></>;
});

describe('Add Notes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(restClient, 'httpPost').mockImplementation(jest.fn());
  });

  it('Should show modal when showModal is true', async () => {
    // Arrange
    const { getByTestId } = render(
      <AddNotes showModal={true} setShowModal={() => {}} entityIds={DEFAULT_ENTITY_IDS} />
    );

    // Assert
    await waitFor(() => {
      expect(getByTestId('modal')).toBeInTheDocument();
    });
  });

  it('Should not show modal when showModal is false', async () => {
    // Arrange
    render(<AddNotes showModal={false} setShowModal={() => {}} entityIds={DEFAULT_ENTITY_IDS} />);

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('Should show required field error when saved without editor input', async () => {
    // Arrange
    const { getByTestId } = render(
      <AddNotes showModal={true} setShowModal={() => {}} entityIds={DEFAULT_ENTITY_IDS} />
    );

    // Act
    await waitFor(() => {
      fireEvent.click(getByTestId('add-notes-save'));
    });

    // Assert
    await waitFor(() => {
      expect(getByTestId('add-notes-error').textContent).toBe('Required Field');
    });
  });

  it('Should close modal when cancel is clicked', async () => {
    // Arrange
    const { getByTestId } = render(
      <DefaultNotesPage
        entityIds={DEFAULT_ENTITY_IDS}
        entityRepName={DEFAULT_LEAD_REPRESENTATION_NAME}
      />
    );

    // Act
    fireEvent.click(getByTestId('default-page-add-notes'));
    await waitFor(() => {
      fireEvent.click(getByTestId('add-notes-cancel'));
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});
