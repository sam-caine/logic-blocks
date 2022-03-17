const data = require('./input.js');

const parseData = (data) => data.split(`\n`);

const shiftToMinute = (shiftPattern) => {
  const [_, minute] = shiftPattern.match(/\d\d:(\d\d)/);
  return +minute;
};

const incrementSleepingMinutes = (guardMinutes, sleepMin, wakeMin) => {
  for (let i = sleepMin; i < wakeMin; i++) {
    guardMinutes[i] += 1;
  }
  return guardMinutes;
};

const findGuardAndMinute = (guardsAndMinutes) => {
  const likelyGuard = { id: null, sleepiestMin: null, sleepMins: -Infinity };
  Object.entries(guardsAndMinutes).forEach(([guard, minutes]) => {
    const currentGuardSleepMins = minutes.reduce((a, b) => a + b);

    if (currentGuardSleepMins > likelyGuard.sleepMins) {
      likelyGuard.sleepMins = currentGuardSleepMins;
      likelyGuard.id = guard;

      const highestSleepFrequency = Math.max(...minutes);
      likelyGuard.sleepiestMin = minutes.findIndex(
        (e) => e === highestSleepFrequency
      );
    }
  });

  return likelyGuard;
};

const createGuardShiftData = (shifts) => {
  const guardsAndMinutes = {};
  let currentGuard = null;
  for (let i = 0; i < shifts.length; i++) {
    const guardId = shifts[i].match(/#\d+/);

    if (guardId) {
      currentGuard = guardId;
      if (!guardsAndMinutes.hasOwnProperty(guardId)) {
        guardsAndMinutes[guardId] = Array(60).fill(0);
      }
    } else if (shifts[i].includes('asleep')) {
      incrementSleepingMinutes(
        guardsAndMinutes[currentGuard],
        shiftToMinute(shifts[i]),
        shiftToMinute(shifts[i + 1])
      );
      i++;
    }
  }
  return guardsAndMinutes;
};

const extractTimeStampAsNumber = (shift) => {
  return +shift.split(']')[0].replace(/\D/g, '');
};

const sortShiftsByDate = (shifts) => {
  shifts.sort((a, b) => {
    return extractTimeStampAsNumber(a) - extractTimeStampAsNumber(b);
  });
  return shifts;
};

const calculateMostLikelyGuardsMostLikelyMinute = (data) => {
  const sortedShiftData = sortShiftsByDate(parseData(data));

  const guardShiftData = createGuardShiftData(sortedShiftData);

  return findGuardAndMinute(guardShiftData);
};

console.log(calculateMostLikelyGuardsMostLikelyMinute(data));

module.exports = {
  shiftToMinute,
  incrementSleepingMinutes,
  createGuardShiftData,
  extractTimeStampAsNumber,
  sortShiftsByDate,
  calculateMostLikelyGuardsMostLikelyMinute,
};
