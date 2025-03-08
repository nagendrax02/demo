import { render, waitFor } from '@testing-library/react';
import { ActivityRenderType } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import Body from './Body';
import InboundPhoneCallActivity from './InboundPhoneCallActivity';
import OutboundPhoneCallActivity from './OutboundPhoneCallActivity';
import * as Utils from './utils';

describe('Body', () => {
  const mockData = {
    AdditionalDetails: {
      ActivityUserFirstName: 'firstName',
      ActivityUserLastName: 'lastName',
      ActivityScore: '5',
      WebPublishedURL: 'https://example.com',
      WebContentName: 'Example',
      ActivityEvent_Note: 'Note',
      IsLandingPage: '1'
    },
    ActivityEvent: ACTIVITY.INBOUND_PHONE_CALL_ACTIVITY,
    ActivityRenderType: ActivityRenderType.Phone
  };

  it('Should render Body component', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('+5')).toBeInTheDocument();
      expect(getByText('View details')).toBeInTheDocument();
    });
  });

  it('Should render InboundPhoneCallActivity when ActivityEvent is INBOUND_PHONE_CALL_ACTIVITY', async () => {
    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText('Inbound phone call activity')).toBeInTheDocument();
    });
  });

  it('Should render OutboundPhoneCallActivity when ActivityEvent is OUTBOUND_PHONE_CALL_ACTIVITY', async () => {
    // Arrange
    mockData.ActivityEvent = ACTIVITY.OUTBOUND_PHONE_CALL_ACTIVITY;

    // Act
    const { getByText } = render(<Body data={mockData} />);

    // Assert
    await waitFor(() => {
      expect(getByText(/Outbound Call: Had a phone call with/i)).toBeInTheDocument();
    });
  });
});

describe('InboundPhoneCallActivity', () => {
  // Arrange
  jest.mock('./utils');

  const mockAdditionalDetails = {
    callStatus: 'answered',
    display: 'John Doe',
    createdBy: '123',
    duration: '5 mins'
  };

  // it('Should render answered call text', async () => {
  //   // Arrange
  //   jest.spyOn(Utils, 'getActivityDetails').mockReturnValue(mockAdditionalDetails);

  //   //  Act
  //   const { getByText } = render(
  //     <InboundPhoneCallActivity additionalDetails={mockAdditionalDetails} />
  //   );

  //   // Assert
  //   await waitFor(() => {
  //     expect(getByText(/Inbound Call: Had a phone call with/i)).toBeInTheDocument();
  //     expect(getByText(/John Doe/i)).toBeInTheDocument();
  //     expect(getByText(/Duration: 5 mins/i)).toBeInTheDocument();
  //   });
  // });

  it('Should render missed call text', () => {
    // Arrange
    mockAdditionalDetails.callStatus = 'missed';
    jest.spyOn(Utils, 'getActivityDetails').mockReturnValue(mockAdditionalDetails);

    // Act
    const { getByText } = render(
      <InboundPhoneCallActivity additionalDetails={mockAdditionalDetails} />
    );

    // Assert
    expect(getByText(/Inbound Call: Missed call/i)).toBeInTheDocument();
  });

  it('Should render default text for invalid status', () => {
    // Arrange
    mockAdditionalDetails.callStatus = 'invalid';
    jest.spyOn(Utils, 'getActivityDetails').mockReturnValue(mockAdditionalDetails);

    // Act
    const { getByText } = render(
      <InboundPhoneCallActivity additionalDetails={mockAdditionalDetails} />
    );

    // Assert
    expect(getByText(/Inbound phone call activity invalid/i)).toBeInTheDocument();
  });
});

describe('OutboundPhoneCallActivity', () => {
  // Arrange
  jest.mock('./utils');

  it('Should render answered call text', () => {
    // Arrange
    const additionalDetails = {
      callStatus: 'answered',
      duration: '5 mins',
      caller: 'John Doe'
    };
    jest.spyOn(Utils, 'getActivityDetails').mockReturnValue(additionalDetails);

    // Act
    const { getByText } = render(
      <OutboundPhoneCallActivity additionalDetails={additionalDetails} />
    );

    // Assert
    expect(getByText(/Outbound Call: Was called by John Doe/i)).toBeInTheDocument();
    expect(getByText(/Duration: 5 mins/i)).toBeInTheDocument();
  });

  it('Should render unanswered call text', () => {
    // Arrange
    const additionalDetails = {
      callStatus: 'missed',
      caller: 'Jane Doe'
    };
    jest.spyOn(Utils, 'getActivityDetails').mockReturnValue(additionalDetails);

    // Act
    const { getByText } = render(
      <OutboundPhoneCallActivity additionalDetails={additionalDetails} />
    );

    // Assert
    expect(getByText(/Outbound Call: Did not answer a call by Jane Doe/i)).toBeInTheDocument();
  });

  it('Should render default text for invalid status', () => {
    // Arrange
    const additionalDetails = {
      callStatus: 'invalid'
    };
    jest.spyOn(Utils, 'getActivityDetails').mockReturnValue(additionalDetails);

    // Act
    const { getByText } = render(
      <OutboundPhoneCallActivity additionalDetails={additionalDetails} />
    );

    // Assert
    expect(getByText(/Outbound Call: Had a phone call with/i)).toBeInTheDocument();
  });
});
