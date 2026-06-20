import {
  allowance,
  carbonStats,
  employeeProfile,
  points,
  routeHistory,
  satisfactionStats,
  tardinessStats,
} from '../data/employeeData';
import { perks } from '../data/perksData';
import { calculateEcoPoints } from './ecoPointsEngine';
import { createSmartSchedule } from './smartScheduler';
import { recommendTransportationRoute } from './transportationRouter';

const wait = (payload, ms = 250) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(payload)), ms);
  });

export const api = {
  getRecommendedRoute: async (preference = 'eco') => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/routes/recommend?preference=${preference}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const envelope = await response.json();
      if (envelope.error) {
        throw new Error(envelope.error);
      }
      return envelope.data;
    } catch (err) {
      console.error("Failed to fetch recommended route from backend, falling back to mock:", err);
      return {
        name: preference === 'speed' ? 'Fully Car (Driving)' : 'LRT Kelana Jaya Line → Walk',
        transportType: preference === 'speed' ? 'Drive' : 'Public Transit',
        travelTime: preference === 'speed' ? '24 mins' : '35 mins',
        carbonSaved: preference === 'speed' ? '0.0 kg CO₂' : '2.3 kg CO₂',
        confidence: '94%',
      };
    }
  },
  postRouteFeedback: (feedback) => wait({ ok: true, feedback }),
  getMySchedule: () => {
    const route = recommendTransportationRoute({
      start_location: 'Subang Jaya',
      destination: 'KL Sentral',
      departure_time: '08:00',
      expected_arrival: '09:00',
      is_rushing: false,
    });
    const smartSchedule = createSmartSchedule({
      day: 'Monday',
      workMode: 'Office',
      officeStart: '09:00',
      officeEnd: '17:00',
      wfhStart: '13:00',
      wfhEnd: '17:00',
      transportPrediction: route,
    });

    const isWfh = smartSchedule.work_mode === 'WFH';
    const isHybrid = smartSchedule.work_mode === 'Hybrid';

    return wait({
      today: smartSchedule.work_mode,
      status: smartSchedule.work_mode,
      arrivalTime: isWfh ? null : smartSchedule.predicted_arrival ?? '08:45',
      suggestedDepartureTime: isWfh ? null : '08:05',
      onlineStartTime: isWfh ? smartSchedule.wfh_hours?.split('-')[0] ?? '09:00' : null,
      location: isWfh ? 'Remote' : 'HQ Floor 2',
      recommendedRoute: isWfh ? null : route.recommended_route,
      officeHours: smartSchedule.office_hours,
      wfhHours: smartSchedule.wfh_hours,
      recommendation: smartSchedule.recommendation,
      approvalStatus: smartSchedule.status,
      week: [
        { day: 'Mon', mode: smartSchedule.work_mode },
        { day: 'Tue', mode: 'WFH' },
        { day: 'Wed', mode: 'Office' },
        { day: 'Thu', mode: 'WFH' },
        { day: 'Fri', mode: isHybrid ? 'Hybrid' : 'Office' },
      ],
      raw: smartSchedule,
    });
  },
  getMyPoints: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/points/me');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      const engineResult = calculateEcoPoints({
        transportationMethod: 'MRT',
        carbonSaved: 2.5,
        travelDistance: 14,
        employeeHistory: {
          currentBalance: 1330,
          consecutiveEcoTrips: 7,
          monthlyGoalAchieved: false,
        },
      });
      return {
        ...points,
        balance: engineResult.current_balance,
        nearestReward: {
          ...points.nearestReward,
          title: engineResult.next_reward,
        },
        pointsEarnedToday: engineResult.points_earned,
        pointsNeeded: engineResult.points_needed,
        validation: engineResult.validation,
      };
    }
  },
  getMyAllowance: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/allowance/me');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return allowance;
    }
  },
  getCarbonStats: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/stats/carbon');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return carbonStats;
    }
  },
  getTardinessStats: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/stats/tardiness');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return tardinessStats;
    }
  },
  getSatisfactionStats: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/stats/satisfaction');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return satisfactionStats;
    }
  },
  getPerks: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/perks');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return perks;
    }
  },
  postClaimPerk: async (perkId) => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/perks/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perkId, employeeId: 1 }),
      });
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return { ok: true, perkId };
    }
  },
  getRouteHistory: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/routes/history');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return routeHistory;
    }
  },
  getEmployeeProfile: async () => {
    try {
      const response = await fetch('http://localhost:8081/internal/v1/employees/profile');
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return employeeProfile;
    }
  },
};

export const endpoints = {
  recommendRoute: 'GET /api/v1/routes/recommend',
  routeFeedback: 'POST /api/v1/routes/feedback',
  scheduleMe: 'GET /api/v1/schedule/me',
  pointsMe: 'GET /api/v1/points/me',
  allowanceMe: 'GET /api/v1/allowance/me',
  carbonStats: 'GET /internal/v1/stats/carbon',
  tardinessStats: 'GET /internal/v1/stats/tardiness',
  satisfactionStats: 'GET /internal/v1/stats/satisfaction',
  perks: 'GET /internal/v1/perks',
  claimPerk: 'POST /internal/v1/perks/claim',
};
