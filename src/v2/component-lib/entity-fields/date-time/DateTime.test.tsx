import { render, fireEvent, screen } from '@testing-library/react';
import DateTime from './DateTime';
import { DateRenderType } from 'apps/entity-details/types/entity-data.types';

//Arrange
const dateTime = '2023-11-06 14:19:00';
const expectedDateTime = '06/11/2307:49:00 PM'; //A separator will be present between date and time

const time = '02:19:00';
const expectedTime = '07:49 AM';

const date = '2023-11-30 00:00:00';
const expectedDate = '30/11/23';

const timeZone = 'Asia/Kolkata';

describe('DateTime', () => {
  test('Should render empty string as date when value not provided', () => {
    //Arrange
    const { container, queryByTestId } = render(
      <DateTime date="" renderType={DateRenderType.Date} />
    );
    //Assert
    expect(container).toHaveTextContent('');
    expect(queryByTestId('date-time-separator')).not.toBeInTheDocument();
  });

  test('Should render the formatted datetime when value provided', () => {
    //Arrange
    const { container, queryByTestId } = render(
      <DateTime
        date={dateTime}
        renderType={DateRenderType.Datetime}
        dateTimeFormat="dd/MM/yy hh:mm:ss a"
        timeZone={timeZone}
      />
    );

    //Assert
    const dateElement = container.querySelector('[data-testid="date-time-component"]');
    const timestamp = dateElement?.textContent?.trim();
    expect(queryByTestId('date-time-separator')).toBeInTheDocument();
    expect(timestamp).toBe(expectedDateTime);
  });

  test('Should render the formatted time when value provided', () => {
    //Arrange
    const { container, queryByTestId } = render(
      <DateTime date={time} renderType={DateRenderType.Time} timeZone={timeZone} />
    );

    //Assert
    const dateElement = container.querySelector('[data-testid="date-time-component"]');
    const timestamp = dateElement?.textContent?.trim();
    expect(timestamp).toBe(expectedTime);
    expect(queryByTestId('date-time-separator')).not.toBeInTheDocument();
  });

  test('Should render the formatted date when value provided', () => {
    //Arrange
    const { container, queryByTestId } = render(
      <DateTime date={date} renderType={DateRenderType.Date} dateTimeFormat="dd/MM/yy" />
    );

    //Assert
    const dateElement = container.querySelector('[data-testid="date-time-component"]');
    const timestamp = dateElement?.textContent?.trim();
    expect(timestamp).toBe(expectedDate);
    expect(queryByTestId('date-time-separator')).not.toBeInTheDocument();
  });
});
