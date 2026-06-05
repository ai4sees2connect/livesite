import getUserIdFromToken from "../student/auth/authUtils";
import axios from 'axios';
import api from '../common/server_url';

const findUser = async () => {
  try {
    const userId = getUserIdFromToken();
    const response = await axios.get(`${api}/findUserType/${userId}`);

    if (response.data.userType === 'student') {
      return {userType:'student', userId: userId}
    } else if (response.data.userType === 'recruiter') {
      return {userType:'recruiter',userId: userId}
    }
  } catch (error) {
    console.error('Error finding user type:', error);
    // You can choose to return 'null' or 'unknown' to handle errors gracefully
    return null;
  }
};

export default findUser;
