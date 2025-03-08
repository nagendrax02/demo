import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Default from './Default';
import Body from './Body';
import Icon from './Icon';
import { ActivityRenderType } from '../../types';

jest.mock('@lsq/nextgen-preact/icon', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-testid="custom-icon">{name}</div>
}));

const testData = {
  ActivityName: 'TestActivity',
  ActivityEvent: 12,
  ActivityRenderType: ActivityRenderType.Custom,
  ActivityType: 1,
  AdditionalDetails: {},
  CanDeleteActivity: false,
  Id: '1',
  IsEditable: 0,
  LeadId: '',
  SystemDate: ''
};

describe('Default Component', () => {
  it('Should render the Body component', async () => {
    // Act
    const { getByText } = render(<Default data={testData} />);

    // Assert
    await waitFor(() => {
      expect(getByText(/Default TestActivity:12/)).toBeInTheDocument();
    });
  });

  it('Should render the Icon component', async () => {
    // Act
    const { getByTestId } = render(<Default data={testData} />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('custom-icon')).toBeInTheDocument();
    });
  });
});

describe('Body Component', () => {
  it('Should render the correct content', () => {
    // Act
    const { getByText } = render(<Body data={testData} />);

    // Assert
    expect(getByText(/Default TestActivity:12/)).toBeInTheDocument();
  });
});

describe('Icon Component', () => {
  it('Should renders the custom icon with the correct name', () => {
    // Act
    const { getByTestId } = render(<Icon />);

    // Assert
    expect(getByTestId('custom-icon')).toHaveTextContent('list_alt');
  });
});
