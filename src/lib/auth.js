const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('eco_current_user');
    if (stored) return JSON.parse(stored);
  } catch (e) {}

  return {
    id: 'EMP001',
    name: 'John Tan',
    department: 'IT',
    email: 'john.tan@egofolks.eco',
    homeLocation: 'Subang Jaya',
    preferredTransport: 'LRT + Walk',
    role: 'employee',
  };
};

export const currentUser = getStoredUser();

export function getCurrentUser() {
  return currentUser;
}

export function updateCurrentUser(updatedFields) {
  Object.assign(currentUser, updatedFields);
  try {
    localStorage.setItem('eco_current_user', JSON.stringify(currentUser));
  } catch (e) {}
  return currentUser;
}
