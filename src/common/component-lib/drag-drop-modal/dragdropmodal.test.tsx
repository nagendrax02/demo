import { fireEvent, render, screen } from '@testing-library/react';
import DragDropModal, { IPosition } from './DragDropModal';

jest.mock('common/component-lib/media-modal/media.store', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node
}));

describe('DragDropModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should render the modal at the correct initial position', () => {
    // Arrange
    require('common/component-lib/media-modal/media.store').default.mockReturnValue({
      showModal: true,
      modalContent: <div>Test Content</div>,
      initialPosition: { x: 100, y: 100 }
    });

    // Act
    render(
      <DragDropModal modalContent={<div>Test Content</div>} initialPosition={{ x: 100, y: 100 }} />
    );

    // Assert
    const modal = screen.getByTestId('drag-drop-modal');
    expect(modal).toHaveStyle('left: 100px; top: 100px;');
  });

  test('Should update the position of the modal when dragging', () => {
    //Arrange
    require('common/component-lib/media-modal/media.store').default.mockReturnValue({
      showModal: true,
      modalContent: <div>Test Content</div>,
      initialPosition: { x: 100, y: 100 }
    });

    // Act
    render(
      <DragDropModal modalContent={<div>Test Content</div>} initialPosition={{ x: 100, y: 100 }} />
    );
    const modal = screen.getByText('Test Content').parentElement;
    expect(modal).not.toBeNull();
    const mouseDownEvent = { clientX: 100, clientY: 100 };
    const mouseMoveEvent = { clientX: 200, clientY: 200 };
    const modalElement = modal as HTMLElement;
    fireEvent.mouseDown(modalElement, mouseDownEvent);
    fireEvent.mouseMove(document, mouseMoveEvent);

    // Assert
    expect(modal).toHaveStyle('left: 200px; top: 200px;');
  });

  test('Should constraint the modal position to the viewport during dragging', () => {
    //Arrange
    require('common/component-lib/media-modal/media.store').default.mockReturnValue({
      showModal: true,
      modalContent: <div>Test Content</div>,
      initialPosition: { x: 100, y: 100 }
    });

    // Act
    render(
      <DragDropModal modalContent={<div>Test Content</div>} initialPosition={{ x: 100, y: 100 }} />
    );
    const modal = screen.getByText('Test Content').parentElement;
    expect(modal).not.toBeNull();
    const mouseDownEvent = { clientX: 100, clientY: 100 };
    const mouseMoveEvent = {
      clientX: window.innerWidth + 100,
      clientY: window.innerHeight + 100
    };
    const modalElement = modal as HTMLElement;
    fireEvent.mouseDown(modalElement, mouseDownEvent);
    fireEvent.mouseMove(document, mouseMoveEvent);

    // Assert
    expect(modal).toHaveStyle(`left: ${window.innerWidth - modalElement.offsetWidth}px;`);
    expect(modal).toHaveStyle(`top: ${window.innerHeight - modalElement.offsetHeight}px;`);
  });

  test('Should save the position to localStorage when dragging stops', () => {
    require('common/component-lib/media-modal/media.store').default.mockReturnValue({
      showModal: true,
      modalContent: <div>Test Content</div>,
      initialPosition: { x: 100, y: 100 }
    });

    // Arrange

    const setPositionMock = jest.fn();
    render(
      <DragDropModal
        modalContent={<div>Test Content</div>}
        initialPosition={{ x: 100, y: 100 }}
        setPosition={setPositionMock}
      />
    );
    const modal = screen.getByText('Test Content').parentElement;
    expect(modal).not.toBeNull();
    const mouseDownEvent = { clientX: 100, clientY: 100 };
    const mouseMoveEvent = { clientX: 200, clientY: 200 };
    const mouseUpEvent = new MouseEvent('mouseup');

    // Act
    const modalElement = modal as HTMLElement;
    fireEvent.mouseDown(modalElement, mouseDownEvent);
    fireEvent.mouseMove(document, mouseMoveEvent);
    fireEvent.mouseUp(document, mouseUpEvent);

    // Assert
    expect(setPositionMock).toHaveBeenCalledWith({ x: 200, y: 200 });
  });

  test('Should verify that modal is not draggable out of viewport', () => {
    // Arrange
    const initialPosition: IPosition = { x: 100, y: 100 };
    const mockSetPosition = jest.fn();

    const { getByTestId } = render(
      <DragDropModal
        modalContent={<div>Test Content</div>}
        initialPosition={initialPosition}
        setPosition={mockSetPosition}
      />
    );
    //Act
    const modal = getByTestId('drag-drop-modal');

    const modalBounds = modal.getBoundingClientRect();
    const mouseDownEvent = { clientX: modalBounds.left + 10, clientY: modalBounds.top + 10 };
    const mouseMoveEvent = { clientX: window.innerWidth + 100, clientY: window.innerHeight + 100 };

    fireEvent.mouseDown(modal, mouseDownEvent);
    fireEvent.mouseMove(document, mouseMoveEvent);
    fireEvent.mouseUp(document);

    // Assert
    const expectedLeft = window.innerWidth - modal.offsetWidth;
    const expectedTop = window.innerHeight - modal.offsetHeight;

    expect(modal.style.left).toBe(`${Math.max(0, Math.min(expectedLeft, window.innerWidth))}px`);
    expect(modal.style.top).toBe(`${Math.max(0, Math.min(expectedTop, window.innerHeight))}px`);
    expect(mockSetPosition).toHaveBeenCalledWith({
      x: Math.max(0, Math.min(expectedLeft, window.innerWidth)),
      y: Math.max(0, Math.min(expectedTop, window.innerHeight))
    });
  });
});
