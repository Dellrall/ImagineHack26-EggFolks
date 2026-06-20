export const carbonScores = {
  Walking: 100,
  Cycling: 95,
  MRT: 85,
  LRT: 80,
  Bus: 70,
  'Car Pool': 50,
  Grab: 35,
  'Private Car': 20,
};

const mockRouteOptions = [
  {
    routeName: 'MRT + Walk',
    transportType: 'MRT',
    estimatedTravelTime: 35,
    distanceKm: 14,
    carbonImpactKg: 0.9,
    carbonSavedKg: 2.5,
    reliability: 88,
    cost: 4.2,
  },
  {
    routeName: 'LRT + Walk',
    transportType: 'LRT',
    estimatedTravelTime: 38,
    distanceKm: 13.5,
    carbonImpactKg: 1.1,
    carbonSavedKg: 2.3,
    reliability: 84,
    cost: 3.8,
  },
  {
    routeName: 'Public Bus + Walk',
    transportType: 'Bus',
    estimatedTravelTime: 48,
    distanceKm: 12.8,
    carbonImpactKg: 1.6,
    carbonSavedKg: 1.8,
    reliability: 72,
    cost: 2.5,
  },
  {
    routeName: 'Car Pool',
    transportType: 'Car Pool',
    estimatedTravelTime: 31,
    distanceKm: 15,
    carbonImpactKg: 2.2,
    carbonSavedKg: 1.2,
    reliability: 82,
    cost: 8,
  },
  {
    routeName: 'Grab',
    transportType: 'Grab',
    estimatedTravelTime: 27,
    distanceKm: 15.2,
    carbonImpactKg: 3.1,
    carbonSavedKg: 0.4,
    reliability: 76,
    cost: 22,
  },
];

function getEnvironmentalScore(route) {
  return carbonScores[route.transportType] ?? 0;
}

function scoreRushingRoute(route) {
  return route.estimatedTravelTime * -1 + route.reliability * 0.01;
}

function scoreEcoRoute(route) {
  return getEnvironmentalScore(route) * 0.45 + route.carbonSavedKg * 12 + route.cost * -0.8 + route.estimatedTravelTime * -0.15;
}

export function recommendTransportationRoute(input) {
  const rankedRoutes = mockRouteOptions
    .map((route) => ({
      ...route,
      environmentalScore: getEnvironmentalScore(route),
      optimizationScore: input.is_rushing ? scoreRushingRoute(route) : scoreEcoRoute(route),
    }))
    .sort((a, b) => b.optimizationScore - a.optimizationScore);

  const recommended = rankedRoutes[0];
  const reason = input.is_rushing
    ? 'Employee is rushing, so the recommendation prioritizes fastest arrival time and route reliability.'
    : 'Employee is not rushing and this route produces the lowest carbon emissions with strong cost efficiency.';

  return {
    recommended_route: recommended.routeName,
    transport_type: recommended.transportType,
    estimated_travel_time: recommended.estimatedTravelTime,
    distance_km: recommended.distanceKm,
    carbon_saved_kg: recommended.carbonSavedKg,
    environmental_score: recommended.environmentalScore,
    reason,
    alternatives: rankedRoutes.slice(1, 4),
    input,
  };
}
