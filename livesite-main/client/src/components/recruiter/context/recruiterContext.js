import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../common/server_url'
// import { useLocation } from "react-router-dom";

// Create the context
const RecruiterContext = createContext();

// Custom hook for accessing the context
export const useRecruiter = () => useContext(RecruiterContext);

export const RecruiterProvider = ({ children }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  // const location = useLocation();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    console.log('Inside useEffect of recruiterContext');
    if (token) {
      try {
        const response = await axios.get(`${api}/recruiter/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data);
        if(!response.data.success){
          console.log('Recruiter is not associated with this token');
          return;
        }
        if(response.data.success){
        setRecruiter(response.data.recruiter);
        console.log('Recruiter found');
        }
      } catch (error) {
        console.error('Error fetching recruiter data:', error);
        // Optionally handle errors (e.g., logout user)
      }
    }
    else {
      setRecruiter(null);
    }
  };

  useEffect(() => {
  
    fetchUserData();
  }, [token]);

  const refreshData=()=>{
    fetchUserData();
  }
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null); // Clear token to trigger refetch
  };

  const login=()=>{
    const token=localStorage.getItem('token');
    setToken(token);
  }

  // const isAuthPage = location.pathname === "recruiter/login" || location.pathname === "recruiter/signup";

  // if (isAuthPage) {
  //   // Do not render the context provider for login or signup pages
  //   return children;
  // }
  return (
    <RecruiterContext.Provider value={{recruiter, logout,login,refreshData}}>
      {children}
    </RecruiterContext.Provider>
  );
};
