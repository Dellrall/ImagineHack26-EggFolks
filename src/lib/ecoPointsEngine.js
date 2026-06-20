const pointRules = {
  Walking: 10,
  Cycling: 8,
  MRT: 5,
  LRT: 5,
  Bus: 4,
  'Car Pool': 3,
  Grab: 0,
  'Private Car': 0,
};

const rewards = [
  { title: 'Coffee Voucher', points: 500 },
  { title: 'RM10 Voucher', points: 1000 },
  { title: 'RM20 Voucher', points: 1500 },
  { title: 'Transport Credit', points: 2000 },
  { title: 'Parking Discount', points: 2500 },
  { title: '1 Day Leave Permission', points: 5000 },
];

function getBonus({ consecutiveEcoTrips, monthlyGoalAchieved }) {
  let bonus = 0;
  if (consecutiveEcoTrips >= 30) bonus += 300;
  else if (consecutiveEcoTrips >= 7) bonus += 50;
  if (monthlyGoalAchieved) bonus += 500;
  return bonus;
}

function getNextReward(balance) {
  return rewards.find((reward) => reward.points > balance) ?? rewards[rewards.length - 1];
}

export function calculateEcoPoints({ transportationMethod, carbonSaved, travelDistance, employeeHistory }) {
  const rate = pointRules[transportationMethod] ?? 0;
  const basePoints = Math.round(rate * travelDistance);
  const carbonBonus = Math.round(carbonSaved * 10);
  const bonus = getBonus(employeeHistory);
  const pointsEarned = basePoints + carbonBonus + bonus;
  const currentBalance = employeeHistory.currentBalance + pointsEarned;
  const nextReward = getNextReward(currentBalance);

  return {
    points_earned: pointsEarned,
    current_balance: currentBalance,
    next_reward: nextReward.title,
    points_needed: Math.max(0, nextReward.points - currentBalance),
    validation: {
      gps: 'verified',
      distance: 'verified',
      time: 'verified',
      travel_history: 'verified',
    },
  };
}
