import {jwtDecode} from 'jwt-decode';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token'); // Or sessionStorage
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    // Check if the token has expired (assuming the token contains an 'exp' field in seconds)
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return decodedToken.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default getUserIdFromToken;