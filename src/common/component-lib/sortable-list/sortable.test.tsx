import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SortableList from './SortableList';
import { handleDragEnd } from './utils/on-drag-end';

const triggerClick = (testId) => {
  fireEvent.click(screen.getByTestId(testId));
};

const testData = [
  { id: 'id1', label: 'Column Name 1', isRemovable: true, isDraggable: true },
  { id: 'id2', label: 'Column Name 2', isRemovable: false, isDraggable: true },
  { id: 'id3', label: 'Column Name 3', isRemovable: false, isDraggable: false },
  { id: 'id4', label: 'Column Name 4', isRemovable: false, isDraggable: false },
  { id: 'id5', label: 'Column Name 5', isRemovable: false, isDraggable: false }
];

const dragEndMock = {
  draggableId: 'LeadAuditLogs',
  type: 'DEFAULT',
  source: {
    index: 2,
    droppableId: 'droppable-id'
  },
  reason: 'DROP',
  mode: 'FLUID',
  destination: {
    droppableId: 'droppable-id',
    index: 1
  },
  combine: null
};

const TestComponent = ({ sortableList, setSortableList, onRemove }) => {
  const { container, queryByTestId } = render(
    <SortableList
      sortableList={sortableList}
      onChange={(data) => {
        setSortableList(data);
      }}
      onRemove={onRemove}
    />
  );

  return { container, queryByTestId };
};

const getMockMethods = () => ({
  sortableList: testData,
  setSortableList: jest.fn(),
  onRemove: jest.fn()
});
describe('SortableList', () => {
  it('Should display list item when rendered', async () => {
    //Arrange

    const { queryByTestId } = TestComponent(getMockMethods());

    //Assert
    await waitFor(() => {
      expect(queryByTestId('id1')).toBeInTheDocument();
      expect(queryByTestId('sortable-list')?.childElementCount).toBe(5);
    });
  });

  it('Should display close button if isRemovable is true', async () => {
    //Arrange
    const { queryByTestId } = TestComponent(getMockMethods());

    //Assert
    await waitFor(() => {
      expect(queryByTestId('id1-close')).toBeInTheDocument();
      expect(queryByTestId('id2-close')).not.toBeInTheDocument();
    });
  });

  it('Should invoke canRemove when click on close icon', async () => {
    //Arrange
    const mocks = getMockMethods();
    const { queryByTestId } = TestComponent(mocks);

    //Act
    triggerClick('id1-close');

    //Assert
    await waitFor(() => {
      expect(mocks.onRemove).toHaveBeenCalledTimes(1);
    });
  });

  it('Should return remaining list items when click on close icon ans onRemove is not provided', async () => {
    //Arrange
    const mocks = getMockMethods();
    const { queryByTestId } = TestComponent({ ...mocks, onRemove: undefined });

    //Act
    triggerClick('id1-close');

    //Assert
    await waitFor(() => {
      expect(mocks.setSortableList).toHaveBeenCalledTimes(1);
      expect(mocks.setSortableList).toHaveBeenCalledWith(
        testData?.filter((test) => test?.id !== 'id1')
      );
    });
  });

  it('Should contain draggable attribute when list item is draggable', () => {
    //Arrange
    const mocks = getMockMethods();
    const { queryByTestId } = TestComponent({ ...mocks, onRemove: undefined });

    //Assert
    expect(queryByTestId('id1')).toHaveAttribute('draggable', 'false');
  });
});

describe('On drag end', () => {
  it('Should invoke  onChange with sorted list when invoked', () => {
    //Arrange
    const onChange = jest.fn();

    //Act
    //@ts-ignore: for testing purpose
    handleDragEnd(dragEndMock, testData, onChange);

    //Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      { id: 'id1', label: 'Column Name 1', isRemovable: true, isDraggable: true },
      { id: 'id3', label: 'Column Name 3', isRemovable: false, isDraggable: false },
      { id: 'id2', label: 'Column Name 2', isRemovable: false, isDraggable: true },
      { id: 'id4', label: 'Column Name 4', isRemovable: false, isDraggable: false },
      { id: 'id5', label: 'Column Name 5', isRemovable: false, isDraggable: false }
    ]);
  });

  it('Should not invoke  onChange when source and destination is same', () => {
    //Arrange
    const onChange = jest.fn();
    const dragEndMock = {
      draggableId: 'LeadAuditLogs',
      type: 'DEFAULT',
      source: {
        index: 1,
        droppableId: 'droppable-id'
      },
      reason: 'DROP',
      mode: 'FLUID',
      destination: {
        droppableId: 'droppable-id',
        index: 1
      },
      combine: null
    };

    //Act
    //@ts-ignore: for testing purpose
    handleDragEnd(dragEndMock, testData, onChange);

    //Assert
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('Should not invoke  onChange when destination is not present', () => {
    //Arrange
    const onChange = jest.fn();
    const dragEndMock = {
      draggableId: 'LeadAuditLogs',
      type: 'DEFAULT',
      source: {
        index: 1,
        droppableId: 'droppable-id'
      },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null
    };

    //Act
    //@ts-ignore: for testing purpose
    handleDragEnd(dragEndMock, testData, onChange);

    //Assert
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
