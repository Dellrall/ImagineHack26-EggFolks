export const employeeProfile = {
  name: 'John Tan',
  department: 'IT',
  email: 'john.tan@egofolks.eco',
  homeLocation: 'Subang Jaya',
  preferredTransport: 'LRT + Walk',
};

export const recommendedRoute = {
  name: 'LRT → Walk',
  transportType: 'Public Transit',
  travelTime: '35 mins',
  carbonSaved: '2.3 kg CO₂',
  confidence: '94%',
};

export const schedule = {
  today: 'Office',
  location: 'HQ Floor 2',
  week: [
    { day: 'Mon', mode: 'Office' },
    { day: 'Tue', mode: 'WFH' },
    { day: 'Wed', mode: 'Office' },
    { day: 'Thu', mode: 'WFH' },
    { day: 'Fri', mode: 'Office' },
  ],
};

export const points = {
  balance: 350,
  monthlyTarget: 500,
  monthlyProgress: 70,
};

export const allowance = {
  transport: 'RM120 remaining',
  carbonCredits: 350,
};

export const routeHistory = [
  { id: 1, date: '2026-06-17', route: 'Route A', transportType: 'LRT + Walk', travelTime: '35 mins', carbonSaved: '2.3 kg', rating: 5 },
  { id: 2, date: '2026-06-16', route: 'Route B', transportType: 'Bus + Walk', travelTime: '42 mins', carbonSaved: '2.0 kg', rating: 4 },
  { id: 3, date: '2026-06-14', route: 'Route C', transportType: 'Carpool', travelTime: '28 mins', carbonSaved: '1.6 kg', rating: 5 },
  { id: 4, date: '2026-06-13', route: 'Route D', transportType: 'Bike + LRT', travelTime: '39 mins', carbonSaved: '2.8 kg', rating: 4 },
  { id: 5, date: '2026-06-12', route: 'Route A', transportType: 'LRT + Walk', travelTime: '36 mins', carbonSaved: '2.2 kg', rating: 5 },
  { id: 6, date: '2026-06-11', route: 'Route B', transportType: 'Bus + Walk', travelTime: '45 mins', carbonSaved: '1.9 kg', rating: 3 },
  { id: 7, date: '2026-06-10', route: 'Route A', transportType: 'LRT + Walk', travelTime: '34 mins', carbonSaved: '2.4 kg', rating: 5 },
];

export const recentNotifications = [
  'Rain forecast after 5 PM. Public transit recommended.',
  'You earned 25 eco points this week.',
  'HQ Floor 2 occupancy is moderate today.',
];

export const carbonStats = {
  total: '1,250 kg CO₂',
  monthly: [
    { label: 'Jan', value: 720 },
    { label: 'Feb', value: 840 },
    { label: 'Mar', value: 930 },
    { label: 'Apr', value: 1050 },
    { label: 'May', value: 1160 },
    { label: 'Jun', value: 1250 },
  ],
};

export const tardinessStats = {
  gridlockHoursAvoided: 620,
  weekly: [
    { label: 'Mon', value: 82 },
    { label: 'Tue', value: 96 },
    { label: 'Wed', value: 74 },
    { label: 'Thu', value: 108 },
    { label: 'Fri', value: 92 },
  ],
};

export const satisfactionStats = {
  score: '4.6 / 5',
  departments: [
    { name: 'IT', value: 34 },
    { name: 'Marketing', value: 22 },
    { name: 'Finance', value: 18 },
    { name: 'Operations', value: 16 },
    { name: 'HR', value: 10 },
  ],
};
