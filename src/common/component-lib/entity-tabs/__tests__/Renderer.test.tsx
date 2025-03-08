import { render, screen } from '@testing-library/react';
import Renderer from '../tab-content/Renderer';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from '../../../constants';

const systemTab = { id: 'Tab1', name: 'Tab 1', isDefault: false, type: 0 };
const connectorTab = { id: 'Tab1', name: 'Tab 1', isDefault: false, type: 1 };
const customActivityTab = { id: 'Tab1', name: 'Tab 1', isDefault: false, type: 2 };

describe('Tab Renderer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should render system tab', () => {
    //Arrange
    render(<Renderer tab={systemTab} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />);

    //Assert
    expect(screen.getByTestId('system-tab')).toBeInTheDocument();
  });

  test('Should render connector tab', () => {
    //Arrange
    render(<Renderer tab={connectorTab} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />);

    //Assert
    expect(screen.getByTestId('connector-tab')).toBeInTheDocument();
  });

  test('Should render custom activity tab', () => {
    //Arrange
    render(<Renderer tab={customActivityTab} coreData={MOCK_ENTITY_DETAILS_CORE_DATA} />);

    //Assert
    expect(screen.getByTestId('custom-activity-tab')).toBeInTheDocument();
  });
});
