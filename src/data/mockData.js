export const employee = {
  name: 'John Tan',
  email: 'john.tan@egofolks.eco',
  department: 'IT',
  todaysMode: 'Office',
  preferredTransport: 'LRT + Walk',
};

export const todaysRoute = {
  recommendation: 'LRT → Walk',
  travelTime: '35 mins',
  carbonSaved: '2.3 kg CO₂',
};

export const carbonSummary = {
  savedThisMonth: '45kg',
  ecoTrips: 18,
  credits: 350,
  rewardTarget: 500,
  nextReward: 'RM20 Grab Voucher',
};

export const routes = [
  {
    id: 1,
    name: 'Route A',
    transportType: 'LRT + Walk',
    estimatedTime: '35 mins',
    carbonSaved: '2.3 kg CO₂ saved',
    comfortScore: '4.5/5',
  },
  {
    id: 2,
    name: 'Route B',
    transportType: 'Bus + Walk',
    estimatedTime: '42 mins',
    carbonSaved: '2.0 kg CO₂ saved',
    comfortScore: '4.1/5',
  },
  {
    id: 3,
    name: 'Route C',
    transportType: 'Carpool',
    estimatedTime: '28 mins',
    carbonSaved: '1.6 kg CO₂ saved',
    comfortScore: '4.7/5',
  },
  {
    id: 4,
    name: 'Route D',
    transportType: 'Bike + LRT',
    estimatedTime: '39 mins',
    carbonSaved: '2.8 kg CO₂ saved',
    comfortScore: '4.3/5',
  },
];

export const rewards = [
  { id: 1, title: 'RM10 Grab Voucher', credits: 100 },
  { id: 2, title: 'RM20 Grab Voucher', credits: 200 },
  { id: 3, title: 'Extra Annual Leave', credits: 500 },
];

export const workspaceSchedule = [
  { day: 'Monday', mode: 'Office', focus: 'Team sync and sprint planning' },
  { day: 'Tuesday', mode: 'WFH', focus: 'Deep work and documentation' },
  { day: 'Wednesday', mode: 'Office', focus: 'Client workshop' },
  { day: 'Thursday', mode: 'WFH', focus: 'Code review and reporting' },
  { day: 'Friday', mode: 'Office', focus: 'Demo and retrospective' },
];

export const notifications = [
  {
    id: 1,
    title: 'Heavy Traffic Expected Tomorrow',
    detail: 'Federal Highway congestion is forecast from 7:30 AM.',
    tone: 'yellow',
  },
  {
    id: 2,
    title: 'WFH Recommended Due To Rain',
    detail: 'Thunderstorms are expected during the morning commute.',
    tone: 'red',
  },
  {
    id: 3,
    title: 'New Carbon Reward Available',
    detail: 'Redeem additional transport vouchers from the rewards hub.',
    tone: 'green',
  },
];
