import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SendEmail from '../SendEmail';
import { mockRepresentationName } from '../constants';
import { CallerSource } from 'src/common/utils/rest-client';

jest.mock('common/component-lib/editor/advanced-editor');

describe('SendEmail', () => {
  it('Should show the modal when show state is true', async () => {
    const setShow = jest.fn();
    render(
      <SendEmail
        show={true}
        setShow={setShow}
        toLead={[]}
        fromUserId=""
        leadRepresentationName={mockRepresentationName}
        callerSource={CallerSource.LeadDetails}
      />
    );
    await waitFor(() => {
      expect(screen.queryByTestId('side-modal')).toBeInTheDocument();
    });
  });

  it('Should not show the modal when show state is false', async () => {
    const { queryByTestId } = render(
      <SendEmail
        show={false}
        setShow={() => {}}
        toLead={[]}
        fromUserId=""
        leadRepresentationName={mockRepresentationName}
        callerSource={CallerSource.LeadDetails}
      />
    );
    const modal = queryByTestId('side-modal');
    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
    });
  });

  it('Should update show state when modal close button is clicked', async () => {
    const setShow = jest.fn();
    const { getByTestId } = render(
      <SendEmail
        show={true}
        setShow={setShow}
        toLead={[]}
        fromUserId=""
        leadRepresentationName={mockRepresentationName}
        callerSource={CallerSource.LeadDetails}
      />
    );
    const closeButton = getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(setShow).toHaveBeenCalledWith(false);
    });
  });
});
