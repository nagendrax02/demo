import { render, screen } from '@testing-library/react';
import MediaModal from './MediaModal';

jest.mock('common/component-lib/media-modal/media.store', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node
}));

jest.mock('common/component-lib/drag-drop-modal', () => ({
  __esModule: true,
  default: ({ modalContent }: { modalContent: React.ReactNode }) => <div>{modalContent}</div>
}));

describe('MediaModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should not render the modal when showModal is false', () => {
    //Arrange
    require('common/component-lib/media-modal/media.store').default.mockReturnValue({
      showModal: false,
      modalContent: <div>Test Content</div>,
      initialPosition: { x: 100, y: 100 }
    });

    // Act
    render(<MediaModal />);

    // Assert
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  test('Should render the modal when showModal is true', () => {
    // Arrange
    require('common/component-lib/media-modal/media.store').default.mockReturnValue({
      showModal: true,
      modalContent: <div>Test Content</div>,
      initialPosition: { x: 100, y: 100 }
    });

    // Act
    const { getByText } = render(<MediaModal />);

    // Assert
    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
