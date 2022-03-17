const { expect } = require('@jest/globals');
const testInput = require('./test-input');
const {
  shiftToMinute,
  incrementSleepingMinutes,
  createGuardShiftData,
  extractTimeStampAsNumber,
  sortShiftsByDate,
  calculateMostLikelyGuardsMostLikelyMinute,
} = require('./main');

describe('shiftToMinute', () => {
  test('converts single digit minute to index', () => {
    expect(shiftToMinute('[1518-11-01 00:05] falls asleep')).toBe(5);
  });
  test('converts double digit minute to index', () => {
    expect(shiftToMinute('[1518-11-01 00:25] wakes up')).toBe(25);
  });
});

describe('incrementSleepingMinutes', () => {
  test('increments all minutes up to but excluding sleeping index', () => {
    const guardMinutes = [0, 1, 2, 3];
    expect(incrementSleepingMinutes(guardMinutes, 1, 3)).toEqual([0, 2, 3, 3]);
  });
});

describe('createGuardShiftData', () => {
  test('maps sleeping minutes for a simple, single shift', () => {
    const shift = [
      '[1518-11-01 00:00] Guard #10 begins shift',
      '[1518-11-01 00:01] falls asleep',
      '[1518-11-01 00:05] wakes up',
    ];

    expect(createGuardShiftData(shift)).toHaveProperty('#10');
    expect(createGuardShiftData(shift)[`#10`].slice(0, 6)).toEqual([
      0, 1, 1, 1, 1, 0,
    ]);
  });
});

describe('extractTimeStampAsNumber', () => {
  test('extracts a timestamp as a number', () => {
    expect(
      extractTimeStampAsNumber('[1518-11-01 00:00] Guard #10 begins shift')
    ).toBe(151811010000);
  });
});

describe('sortShiftsByDate', () => {
  test('doesnt change sorted list', () => {
    const shifts = [
      '[1518-11-01 00:00] Guard #10 begins shift',
      '[1518-11-01 00:01] falls asleep',
      '[1518-11-01 00:05] wakes up',
    ];
    const shiftsCopy = shifts.slice();
    expect(sortShiftsByDate(shifts)).toEqual(shiftsCopy);
  });
  test('sorts unsorted list', () => {
    const unsortedShifts = [
      '[1518-11-01 00:05] wakes up',
      '[1518-11-01 00:01] falls asleep',
      '[1518-11-01 00:00] Guard #10 begins shift',
    ];
    const sortedShifts = [
      '[1518-11-01 00:00] Guard #10 begins shift',
      '[1518-11-01 00:01] falls asleep',
      '[1518-11-01 00:05] wakes up',
    ];
    expect(sortShiftsByDate(unsortedShifts)).toEqual(sortedShifts);
  });
});

describe('calculateMostLikelyGuardsMostLikelyMinute', () => {
  test('works with the test input', () => {
    expect(calculateMostLikelyGuardsMostLikelyMinute(testInput)).toEqual({
      id: '#10',
      sleepMins: 50,
      sleepiestMin: 24,
    });
  });
});
