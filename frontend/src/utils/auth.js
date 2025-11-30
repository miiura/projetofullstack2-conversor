export function isLogged() {
  // simple check for a token
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
