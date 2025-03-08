import { fireEvent, render, screen } from '@testing-library/react';
import EmailHeader from '../EmailHeader';

const data = {
  subject: 'A little gift from nouvetta ABCDEFGHIJKLMNOPQRSTUVWXYZ 123456789!',
  body: '<div> email body </div>',
  category: 'Promotional Emails',
  ccBccData: {
    Cc: {
      Leads: [
        {
          Name: 'chinta',
          Email: 'hello@asdsdasdsd.com'
        },
        {
          Name: 'rohit',
          Email: 'rohit17@mailinator.com'
        }
      ],
      Users: [
        {
          Name: 'Abhishek Jalan',
          Email: 'rohitdtest@mailinator.com'
        },
        {
          Name: 'muskansu',
          Email: 'muskansu.9695@mailinator.com'
        }
      ]
    },
    Bcc: {
      Leads: [
        {
          Name: 'John Doe',
          Email: 'rohith.gb@leadsquared.com'
        }
      ],
      Users: [
        {
          Name: 'Rohith',
          Email: 'rohith.9695nouvetta@mailinator.com'
        },
        {
          Name: 'rohit9695',
          Email: 'rohit9695@mailinator.com'
        },
        {
          Name: 'abhi 9695',
          Email: 'abhi.9695@mailinator.com'
        }
      ]
    }
  },
  campaignAttachments: [],
  fromUsername: 'Rohith',
  fromUserId: 'df01b7f0-a351-11ec-86c0-02930afc2f3c',
  replyTo: {
    name: '',
    email: ''
  }
};

describe('Email Header', () => {
  test('Should render email body', () => {
    //Arrange
    render(<EmailHeader data={data} />);

    //Assert
    expect(screen.getByText(/hello@asdsdasdsd.com/)).toBeInTheDocument();
  });
});
