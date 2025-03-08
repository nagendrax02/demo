import { render } from '@testing-library/react';
import MoreTabs from '../components/more-tabs';
import { ITabConfig, TabIconType, TabType } from '../app-tabs.types';

describe('MoreTabs', () => {
  const mockConfig: ITabConfig[] = [
    {
      id: '1',
      title: 'Tab 1',
      url: 'http://localhost/tab1',
      type: TabType.Primary,
      isActiveTab: false,
      iconType: TabIconType.Lead
    },
    {
      id: '2',
      title: 'Tab 2',
      url: 'http://localhost/tab2',
      type: TabType.Secondary,
      isActiveTab: true,
      iconType: TabIconType.Lead
    }
  ];

  it('Should render null if config is empty', () => {
    // Act
    const { container } = render(<MoreTabs config={[]} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('Should render the more tabs when config is provided', async () => {
    // Act
    const { getByTestId } = render(<MoreTabs config={mockConfig} />);

    // Assert
    expect(getByTestId('more-tabs-wrapper')).toBeInTheDocument();
  });
});
