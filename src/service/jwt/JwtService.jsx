import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('userToken');

export const isLoggedIn = () => {
  const token = getToken();
  if (token=='undefined' || token==null) {
    return false;
  }
  return !!token && !isTokenExpired(token);
};

const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken.exp < Date.now() / 1000;
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.roles;  // Assuming the token contains a 'role' field
};

export const getEmail = () => {
  const token = getToken();
  if (!token) return null;
  const decodedToken = jwtDecode(token);
  return decodedToken.sub;  // Assuming the token contains a 'role' field
};
export const clearSession = () => {
  localStorage.removeItem('userToken');
  window.location.href = '/';
}