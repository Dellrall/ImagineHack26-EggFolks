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

const getStoredClaimedPerks = () => {
  try {
    const stored = localStorage.getItem('eco_claimed_perks');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredClaimedPerks = (claimed) => {
  try {
    localStorage.setItem('eco_claimed_perks', JSON.stringify(claimed));
  } catch (e) {}
};

const getDeductedPoints = () => {
  const claimed = getStoredClaimedPerks();
  return claimed.reduce((sum, perk) => sum + (perk.pointsRequired || 0), 0);
};

export const api = {
  getRecommendedRoute: () => {
    const recommendation = recommendTransportationRoute({
      start_location: 'Subang Jaya',
      destination: 'KL Sentral',
      departure_time: '08:00',
      expected_arrival: '09:00',
      is_rushing: false,
    });

    return wait({
      name: recommendation.recommended_route,
      transportType: recommendation.transport_type,
      travelTime: `${recommendation.estimated_travel_time} mins`,
      carbonSaved: `${recommendation.carbon_saved_kg} kg CO₂`,
      carbonSavedTodayKg: recommendation.carbon_saved_kg,
      confidence: '94%',
      reason: recommendation.reason,
      environmentalScore: recommendation.environmental_score,
      alternatives: recommendation.alternatives,
      raw: recommendation,
    });
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
  getMyPoints: () => {
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

    const deducted = getDeductedPoints();
    const finalBalance = Math.max(0, engineResult.current_balance - deducted);

    return wait({
      ...points,
      balance: finalBalance,
      nearestReward: {
        ...points.nearestReward,
        title: engineResult.next_reward,
      },
      pointsEarnedToday: engineResult.points_earned,
      pointsNeeded: Math.max(0, points.nearestReward.pointsRequired - finalBalance),
      validation: engineResult.validation,
    });
  },
  getMyAllowance: () => wait(allowance),
  getCarbonStats: () => wait(carbonStats),
  getTardinessStats: () => wait(tardinessStats),
  getSatisfactionStats: () => wait(satisfactionStats),
  getPerks: () => wait(perks),
  postClaimPerk: (perkId) => {
    const perk = perks.find((p) => p.id === perkId);
    if (!perk) {
      return wait({ ok: false, error: 'Perk not found' });
    }

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

    const deducted = getDeductedPoints();
    const finalBalance = Math.max(0, engineResult.current_balance - deducted);

    if (finalBalance < perk.pointsRequired) {
      return wait({ ok: false, error: 'Insufficient points to claim this perk' });
    }

    const claimed = getStoredClaimedPerks();
    const newClaim = {
      ...perk,
      claimedAt: new Date().toISOString(),
      claimId: `${perkId}-${Date.now()}`
    };
    claimed.push(newClaim);
    saveStoredClaimedPerks(claimed);

    return wait({ ok: true, claim: newClaim });
  },
  getClaimedPerks: () => wait(getStoredClaimedPerks()),
  getRouteHistory: () => wait(routeHistory),
  getEmployeeProfile: () => wait(employeeProfile),
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
  claimedPerks: 'GET /internal/v1/perks/claimed',
};
