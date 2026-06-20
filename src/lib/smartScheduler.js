const companyOpenMinutes = 9 * 60;
const companyCloseMinutes = 21 * 60;
const severeWeather = {
  rainForecast: true,
  floodAlert: false,
  stormAlert: false,
};

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

function isWeekend(day) {
  return ['Saturday', 'Sunday'].includes(day);
}

export function createSmartSchedule({ day, workMode, officeStart, officeEnd, wfhStart, wfhEnd, transportPrediction }) {
  if (isWeekend(day)) {
    return {
      work_mode: 'WFH',
      office_hours: null,
      wfh_hours: '09:00-17:00',
      predicted_arrival: null,
      status: 'Approved',
      recommendation: 'Saturday and Sunday are always WFH days.',
      weather: severeWeather,
    };
  }

  const officeStartMinutes = officeStart ? toMinutes(officeStart) : null;
  const officeEndMinutes = officeEnd ? toMinutes(officeEnd) : null;

  if (workMode !== 'WFH') {
    if (officeStartMinutes < companyOpenMinutes || officeEndMinutes > companyCloseMinutes) {
      return {
        work_mode: workMode,
        office_hours: `${officeStart}-${officeEnd}`,
        wfh_hours: workMode === 'Hybrid' ? `${wfhStart}-${wfhEnd}` : null,
        predicted_arrival: null,
        status: 'Rejected',
        recommendation: 'Selected office time exceeds operating hours. Suggested alternative: 09:00-17:00.',
        weather: severeWeather,
      };
    }
  }

  const predictedArrivalMinutes = transportPrediction
    ? officeStartMinutes - 15 + transportPrediction.estimated_travel_time
    : null;
  const willBeLate = workMode !== 'WFH' && predictedArrivalMinutes > officeStartMinutes;
  const weatherRisk = severeWeather.rainForecast || severeWeather.floodAlert || severeWeather.stormAlert;

  if (willBeLate && weatherRisk) {
    return {
      work_mode: 'WFH',
      office_hours: null,
      wfh_hours: '11:00-19:00',
      predicted_arrival: toTime(predictedArrivalMinutes),
      status: 'Changed',
      recommendation: 'Congestion and weather risk detected. WFH is recommended to prevent tardiness.',
      weather: severeWeather,
    };
  }

  if (willBeLate) {
    return {
      work_mode: workMode,
      office_hours: `${toTime(officeStartMinutes + 30)}-${toTime(officeEndMinutes + 30)}`,
      wfh_hours: workMode === 'Hybrid' ? `${wfhStart}-${wfhEnd}` : null,
      predicted_arrival: toTime(predictedArrivalMinutes),
      status: 'Adjusted',
      recommendation: `Employee will be late. Shift office slot to ${toTime(officeStartMinutes + 30)} or leave home earlier.`,
      weather: severeWeather,
    };
  }

  return {
    work_mode: workMode,
    office_hours: workMode === 'WFH' ? null : `${officeStart}-${officeEnd}`,
    wfh_hours: workMode === 'Office' ? null : `${wfhStart}-${wfhEnd}`,
    predicted_arrival: predictedArrivalMinutes ? toTime(predictedArrivalMinutes) : null,
    status: 'Approved',
    recommendation: 'Office schedule accepted.',
    weather: severeWeather,
  };
}
