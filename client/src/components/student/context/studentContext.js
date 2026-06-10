import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../common/server_url';

// Create the context
const StudentContext = createContext();

// Custom hook for accessing the context
export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUserData = async () => {
    const currentToken = localStorage.getItem('token');
    
    if (currentToken) {
      try {
        const response = await axios.get(`${api}/student/details`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        
        if (response.data.success) {
          setStudent(response.data.student);
        }
      } catch (error) {
        // Error handling can be added here if needed
      }
    } else {
      setStudent(null);
    }
  };

  const refreshData = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null); // Clear token to trigger refetch
  };

  const login = () => {
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
  };

  return (
    <StudentContext.Provider value={{ student, logout, login, refreshData }}>
      {children}
    </StudentContext.Provider>
  );
};