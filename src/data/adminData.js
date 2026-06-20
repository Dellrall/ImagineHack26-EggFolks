export const adminEmployees = [
  { id: 'EMP001', name: 'John Tan', department: 'IT', carbonSaved: '45 kg', ecoPoints: 350, satisfaction: 4.8, tardiness: 'Low' },
  { id: 'EMP002', name: 'Aina Rahman', department: 'Marketing', carbonSaved: '52 kg', ecoPoints: 420, satisfaction: 4.6, tardiness: 'Low' },
  { id: 'EMP003', name: 'Priya Nair', department: 'Finance', carbonSaved: '38 kg', ecoPoints: 275, satisfaction: 4.4, tardiness: 'Medium' },
  { id: 'EMP004', name: 'Daniel Lee', department: 'Operations', carbonSaved: '31 kg', ecoPoints: 180, satisfaction: 4.1, tardiness: 'Medium' },
  { id: 'EMP005', name: 'Mei Wong', department: 'HR', carbonSaved: '61 kg', ecoPoints: 510, satisfaction: 4.9, tardiness: 'Low' },
];

export const adminKpis = [
  { label: 'Total Carbon Saved', value: '1,250 kg CO₂' },
  { label: 'Gridlock Hours Avoided', value: '620 hrs' },
  { label: 'Employee Satisfaction', value: '4.6 / 5' },
  { label: 'Office Density', value: '72%' },
  { label: 'Total Eco Points Issued', value: '12,500' },
];

export const adminSchedules = [
  { employee: 'John Tan', department: 'IT', mon: 'Office', tue: 'WFH', wed: 'Office', thu: 'WFH', fri: 'Office' },
  { employee: 'Aina Rahman', department: 'Marketing', mon: 'WFH', tue: 'WFH', wed: 'Office', thu: 'Office', fri: 'WFH' },
  { employee: 'Priya Nair', department: 'Finance', mon: 'Office', tue: 'Office', wed: 'Office', thu: 'WFH', fri: 'Office' },
  { employee: 'Mei Wong', department: 'HR', mon: 'WFH', tue: 'Office', wed: 'WFH', thu: 'Office', fri: 'Office' },
];

export const reportCards = [
  'Carbon Report',
  'Office Density Report',
  'Satisfaction Report',
  'ESG Report',
].map((title) => ({ title, description: `${title} generated from mock sustainability data.` }));
