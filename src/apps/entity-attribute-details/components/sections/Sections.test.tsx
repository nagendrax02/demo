import { render, screen, waitFor } from '@testing-library/react';
import Sections from './Sections';
import Section from './Section';

describe('Entity Details Attribute Sections', () => {
  test('Should render sections', () => {
    //Arrange
    render(<Sections />);

    //Assert
    expect(screen.getByTestId('ead-sections')).toBeInTheDocument();
  });

  test('Should render section', async () => {
    //Arrange
    render(<Section data={{ id: '1', name: 'Section 1', fields: [] }} />);

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('ead-section')).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });
  });
});
