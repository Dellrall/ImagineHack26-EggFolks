export const adminKpis = [
  { label: 'Total Employees', value: '245' },
  { label: 'Active Today', value: '198' },
  { label: 'Employees WFH', value: '47' },
  { label: 'Carbon Saved This Month', value: '1,250 kg CO₂' },
  { label: 'Carbon Credits Issued', value: '12,500' },
  { label: 'Office Occupancy', value: '72%' },
];

export const sustainabilityMetrics = [
  { label: 'Carbon Saved', value: '1250 kg' },
  { label: 'Fuel Saved', value: '430 L' },
  { label: 'Traffic Hours Avoided', value: '620 Hours' },
];

export const floorOccupancy = [
  { floor: 'Floor 1', occupancy: 85 },
  { floor: 'Floor 2', occupancy: 60 },
  { floor: 'Floor 3', occupancy: 42 },
];

export const employees = [
  { id: 'EMP001', name: 'John Tan', department: 'IT', workMode: 'Office', credits: 350, status: 'Active' },
  { id: 'EMP002', name: 'Aina Rahman', department: 'Marketing', workMode: 'WFH', credits: 420, status: 'Active' },
  { id: 'EMP003', name: 'Priya Nair', department: 'Finance', workMode: 'Office', credits: 275, status: 'Active' },
  { id: 'EMP004', name: 'Daniel Lee', department: 'Operations', workMode: 'WFH', credits: 180, status: 'Inactive' },
  { id: 'EMP005', name: 'Mei Wong', department: 'HR', workMode: 'Office', credits: 510, status: 'Active' },
  { id: 'EMP006', name: 'Adam Lim', department: 'Marketing', workMode: 'WFH', credits: 260, status: 'Active' },
];

export const workspaceStats = [
  { label: 'Meeting Rooms', value: '12 / 20 Used' },
  { label: 'Workstations', value: '140 / 200 Used' },
  { label: 'Office Floors', value: '3 Active Floors' },
  { label: 'WFH Allocation', value: '47 Employees' },
];

export const heatmapSeats = [
  'available', 'moderate', 'available', 'crowded', 'available', 'moderate',
  'available', 'available', 'crowded', 'moderate', 'available', 'available',
  'moderate', 'crowded', 'available', 'available', 'moderate', 'available',
  'crowded', 'moderate', 'available', 'available', 'available', 'moderate',
];

export const monthlyCarbon = [
  { month: 'Jan', carbon: 780 },
  { month: 'Feb', carbon: 860 },
  { month: 'Mar', carbon: 940 },
  { month: 'Apr', carbon: 1080 },
  { month: 'May', carbon: 1160 },
  { month: 'Jun', carbon: 1250 },
];

export const weeklyCarbon = [
  { day: 'Mon', carbon: 180 },
  { day: 'Tue', carbon: 225 },
  { day: 'Wed', carbon: 205 },
  { day: 'Thu', carbon: 260 },
  { day: 'Fri', carbon: 240 },
];

export const departmentContribution = [
  { name: 'IT', value: 34 },
  { name: 'Marketing', value: 21 },
  { name: 'Finance', value: 18 },
  { name: 'Operations', value: 16 },
  { name: 'HR', value: 11 },
];

export const topEcoEmployees = [
  { name: 'Mei Wong', credits: 510 },
  { name: 'Aina Rahman', credits: 420 },
  { name: 'John Tan', credits: 350 },
  { name: 'Priya Nair', credits: 275 },
];

export const carbonMetrics = [
  { label: 'Total CO₂ Saved', value: '1,250 kg' },
  { label: 'Average Per Employee', value: '5.1 kg' },
  { label: 'Most Sustainable Department', value: 'IT' },
  { label: 'Highest Carbon Saver', value: 'Mei Wong' },
];

export const routeAnalytics = [
  { route: 'Route A', usage: 120, avgTime: '35 mins', carbonSaved: '2.3kg', rating: 4.6 },
  { route: 'Route B', usage: 86, avgTime: '42 mins', carbonSaved: '2.0kg', rating: 4.2 },
  { route: 'Route C', usage: 74, avgTime: '28 mins', carbonSaved: '1.6kg', rating: 4.7 },
  { route: 'Route D', usage: 51, avgTime: '39 mins', carbonSaved: '2.8kg', rating: 4.4 },
];

export const routeChartData = routeAnalytics.map((route) => ({
  name: route.route,
  usage: route.usage,
  rating: route.rating,
}));

export const aiRecommendations = [
  {
    title: 'High Traffic Predicted Tomorrow',
    action: 'Recommend WFH for Marketing Department',
    impact: 'Expected Carbon Reduction: 18%',
    confidence: '92%',
  },
  {
    title: 'Heavy Rain Forecast',
    action: 'Recommend Public Transit',
    impact: 'Expected Carbon Reduction: 9%',
    confidence: '86%',
  },
  {
    title: 'Office Occupancy Exceeds 85%',
    action: 'Recommend Hybrid Schedule',
    impact: 'Expected Energy Savings: 15%',
    confidence: '89%',
  },
];

export const adminNotifications = [
  { title: 'Traffic Alert', message: 'Major delay expected on Federal Highway.', tone: 'red' },
  { title: 'Weather Alert', message: 'Rain forecast during morning arrival window.', tone: 'yellow' },
  { title: 'Carbon Goal Achieved', message: 'Monthly target exceeded by 12%.', tone: 'green' },
  { title: 'Office Maintenance', message: 'Floor 2 meeting rooms unavailable after 6 PM.', tone: 'blue' },
  { title: 'System Update', message: 'Route model refresh scheduled tonight.', tone: 'blue' },
];

export const reports = [
  'Monthly Sustainability Report',
  'Carbon Savings Report',
  'Employee Participation Report',
  'Office Utilization Report',
  'ESG Summary Report',
].map((title, index) => ({ id: index + 1, title }));
