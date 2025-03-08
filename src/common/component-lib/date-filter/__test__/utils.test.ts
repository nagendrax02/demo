import {
  fetchOptions,
  getWeekStartOn,
  getYesterday,
  getTomorrow,
  getLastMonth,
  getThisMonth,
  getNextMonth,
  getLastYear,
  getThisYear,
  getNextYear,
  getLast7Days,
  getLast30Days,
  getNext7Days,
  utcFormat
} from '../utils';

import { getItem } from '../../../utils/storage-manager';
import {
  add,
  endOfMonth,
  endOfToday,
  endOfTomorrow,
  endOfYear,
  endOfYesterday,
  startOfMonth,
  startOfToday,
  startOfTomorrow,
  startOfYear,
  startOfYesterday
} from '@lsq/nextgen-preact/date/utils';

jest.mock('../../../utils/storage-manager', () => ({
  getItem: jest.fn(),
  StorageKey: {
    Auth: 'auth'
  }
}));

describe('Date Filter Utilities', () => {
  it('fetchOptions should return an array of options', async () => {
    // Act
    const options = await fetchOptions();

    // Assert
    expect(Array.isArray(options)).toBe(true);
  });

  it('Should return a number representing the day of the week when getWeekStartOn  called', () => {
    // Arrange
    const mockAuthDetails = {
      Tenant: {
        DefinedWeek: 'Monday to Sunday'
      }
    };
    (getItem as jest.Mock).mockReturnValue(mockAuthDetails);

    // Act
    const weekStartOn = getWeekStartOn();
    // Assert
    expect(typeof weekStartOn === 'number' && weekStartOn >= 0 && weekStartOn <= 6).toBe(true);
  });

  it('Should return an object with startDate and endDate properties representing yesterday when getYesterday called', () => {
    // Act
    const yesterday = getYesterday();

    // Assert
    expect(yesterday.startDate).toEqual(startOfYesterday());
    expect(yesterday.endDate).toEqual(endOfYesterday());
  });

  it('Should return an object with startDate and endDate properties representing tomorrow when getTomorrow called', () => {
    // Act
    const tomorrow = getTomorrow();

    // Assert
    expect(tomorrow.startDate).toEqual(startOfTomorrow());
    expect(tomorrow.endDate).toEqual(endOfTomorrow());
  });

  it('Should return an object with startDate and endDate properties representing the last month when getLastMonth called', () => {
    // Act
    const lastMonth = getLastMonth();
    const expectedStartDate = startOfMonth(add(startOfMonth(startOfToday()), { days: -1 }));
    const expectedEndDate = endOfMonth(add(startOfMonth(startOfToday()), { days: -1 }));

    // Assert
    expect(lastMonth.startDate).toEqual(expectedStartDate);
    expect(lastMonth.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the current month when getThisMonth called', () => {
    // Act
    const thisMonth = getThisMonth();
    const expectedStartDate = startOfMonth(startOfToday());
    const expectedEndDate = endOfMonth(startOfToday());

    // Assert
    expect(thisMonth.startDate).toEqual(expectedStartDate);
    expect(thisMonth.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the next month when getNextMonth called', () => {
    // Act
    const nextMonth = getNextMonth();
    const expectedStartDate = startOfMonth(add(endOfMonth(startOfToday()), { days: 1 }));
    const expectedEndDate = endOfMonth(add(endOfMonth(startOfToday()), { days: 1 }));

    // Assert
    expect(nextMonth.startDate).toEqual(expectedStartDate);
    expect(nextMonth.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the last year when getLastYear called', () => {
    // Act
    const lastYear = getLastYear();
    const expectedStartDate = startOfYear(add(startOfYear(startOfToday()), { days: -1 }));
    const expectedEndDate = endOfYear(add(startOfYear(startOfToday()), { days: -1 }));

    // Assert
    expect(lastYear.startDate).toEqual(expectedStartDate);
    expect(lastYear.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the current year when getThisYear called', () => {
    // Act
    const thisYear = getThisYear();
    const expectedStartDate = startOfYear(startOfToday());
    const expectedEndDate = endOfYear(startOfToday());

    // Assert
    expect(thisYear.startDate).toEqual(expectedStartDate);
    expect(thisYear.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the next year when getNextYear called', () => {
    // Act
    const nextYear = getNextYear();
    const expectedStartDate = startOfYear(add(endOfYear(startOfToday()), { days: 1 }));
    const expectedEndDate = endOfYear(add(endOfYear(startOfToday()), { days: 1 }));

    // Assert
    expect(nextYear.startDate).toEqual(expectedStartDate);
    expect(nextYear.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the last 7 days when getLast7Days', () => {
    // Act
    const last7Days = getLast7Days();
    const expectedStartDate = add(startOfToday(), { days: -6 });
    const expectedEndDate = endOfToday();

    // Assert
    expect(last7Days.startDate).toEqual(expectedStartDate);
    expect(last7Days.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the last 30 days when getNext7Days called', () => {
    // Act
    const last30Days = getLast30Days();
    const expectedStartDate = add(startOfToday(), { days: -29 });
    const expectedEndDate = endOfToday();

    // Assert
    expect(last30Days.startDate).toEqual(expectedStartDate);
    expect(last30Days.endDate).toEqual(expectedEndDate);
  });

  it('Should return an object with startDate and endDate properties representing the next 7 days when getNext7Days called', () => {
    // Act
    const next7Days = getNext7Days();
    const expectedStartDate = startOfTomorrow();
    const expectedEndDate = add(endOfToday(), { days: 7 });

    // Assert
    expect(next7Days.startDate).toEqual(expectedStartDate);
    expect(next7Days.endDate).toEqual(expectedEndDate);
  });

  it('Should return date string to UTC format', () => {
    // Act
    const inputDate = '2023-01-01T12:00:00';
    const formattedDate = utcFormat(inputDate);

    // Assert
    expect(formattedDate).toBe('2023-01-01 12:00:00');
  });
});
