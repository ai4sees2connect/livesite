import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../common/server_url';

// Create the context
const RecruiterContext = createContext();

// Custom hook for accessing the context
export const useRecruiter = () => useContext(RecruiterContext);

export const RecruiterProvider = ({ children }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUserData = async () => {
    const currentToken = localStorage.getItem('token');
    
    if (currentToken) {
      try {
        const response = await axios.get(`${api}/recruiter/details`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        
        if (response.data.success) {
          setRecruiter(response.data.recruiter);
        }
      } catch (error) {
        // Error handling can be added here if needed
      }
    } else {
      setRecruiter(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const refreshData = () => {
    fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null); // Clear token to trigger refetch
  };

  const login = () => {
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
  };

  return (
    <RecruiterContext.Provider value={{ recruiter, logout, login, refreshData }}>
      {children}
    </RecruiterContext.Provider>
  );
};