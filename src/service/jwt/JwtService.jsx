import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
   const token=localStorage.getItem('userToken');
   if (token=='undefined' || token==null) {
    window.location.href = '/';
  }
    return token;
}
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

export const isAdminRole = () => {
  const role = getUserRole();
  return role.includes('ADMIN');
}
export const isUserRole = () => {
  const role = getUserRole();
  return role.includes('USER') && !role.includes('ADMIN') && role.includes('VISITOR');
}
export const isVisitorRole = () => {
  const role = getUserRole();
  return role.includes('VISITOR') && !role.includes('ADMIN') && !role.includes('USER');
}
