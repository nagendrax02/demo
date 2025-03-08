import { fireEvent, render } from '@testing-library/react';
import Tab from '../Tab';

describe('Tab', () => {
  test('Should render tab', () => {
    //Arrange
    const { getByTestId, getByText } = render(
      <Tab tabKey="1" name={'Tab 1'} activeTabKey="" setActiveTabKey={() => {}} />
    );

    //Assert
    expect(getByText('Tab 1')).toBeInTheDocument();
  });

  test('Should render tab with active state when active tab key is passed', () => {
    //Arrange
    const { getByText, container } = render(
      <Tab tabKey="1" name={'Tab 1'} activeTabKey="1" setActiveTabKey={() => {}} />
    );

    //Assert
    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(container?.firstChild).toHaveClass('active');
  });

  test('Should set active tab key when tab is clicked', () => {
    //Arrange
    let activeTabKey = '1';
    const setActiveTabKey = () => {
      activeTabKey = '2';
    };
    const { getByText } = render(
      <>
        <Tab
          tabKey="1"
          name={'Tab 1'}
          activeTabKey={activeTabKey}
          setActiveTabKey={setActiveTabKey}
        />
        <Tab
          tabKey="2"
          name={'Tab 2'}
          activeTabKey={activeTabKey}
          setActiveTabKey={setActiveTabKey}
        />
      </>
    );
    const tabSecondEl = getByText('Tab 2');

    //Act
    fireEvent.click(tabSecondEl);

    //Assert
    expect(activeTabKey).toBe('2');
  });
});
