import { render } from '@testing-library/react';
import VisibleTabs from '../components/visible-tabs';
import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';

jest.mock('../components/tab', () => (props) => <div data-testid="visible-tab">{props.title}</div>);

describe('VisibleTabs', () => {
  const mockConfig: ITabConfig[] = [
    {
      id: '1',
      type: TabType.Primary,
      title: 'Tab 1',
      url: 'http://example.com',
      isActiveTab: true,
      iconType: TabIconType.Lead
    },
    {
      id: '2',
      type: TabType.Secondary,
      title: 'Tab 2',
      url: 'http://example.com',
      isActiveTab: false,
      iconType: TabIconType.Account
    }
  ];

  it('Should render null if config is empty', () => {
    // Act
    const { container } = render(<VisibleTabs config={[]} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('Should render the correct number of tabs', () => {
    // Act
    const { getAllByTestId } = render(<VisibleTabs config={mockConfig} />);

    // Assert
    const tabs = getAllByTestId('visible-tab');
    expect(tabs).toHaveLength(mockConfig.length);
  });
});
