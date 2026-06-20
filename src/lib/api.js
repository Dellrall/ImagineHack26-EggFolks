import {
  allowance,
  carbonStats,
  employeeProfile,
  points,
  recommendedRoute,
  routeHistory,
  schedule,
  satisfactionStats,
  tardinessStats,
} from '../data/employeeData';
import { perks } from '../data/perksData';

const wait = (payload, ms = 250) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(payload)), ms);
  });

export const api = {
  getRecommendedRoute: () => wait(recommendedRoute),
  postRouteFeedback: (feedback) => wait({ ok: true, feedback }),
  getMySchedule: () => wait(schedule),
  getMyPoints: () => wait(points),
  getMyAllowance: () => wait(allowance),
  getCarbonStats: () => wait(carbonStats),
  getTardinessStats: () => wait(tardinessStats),
  getSatisfactionStats: () => wait(satisfactionStats),
  getPerks: () => wait(perks),
  postClaimPerk: (perkId) => wait({ ok: true, perkId }),
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
};
