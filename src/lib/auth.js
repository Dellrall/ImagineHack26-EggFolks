export const currentUser = {
  id: 'EMP001',
  name: 'John Tan',
  department: 'IT',
  email: 'john.tan@egofolks.eco',
  homeLocation: 'Subang Jaya',
  preferredTransport: 'LRT + Walk',
  role: 'employee',
};

export function getCurrentUser() {
  return currentUser;
}
