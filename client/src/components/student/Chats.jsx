import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify'
import api from '../common/server_url';

const Chats = () => {

  const {studentId}=useParams();
  const [shortlistedInternships, setShortlistedInternships] = useState([]);

  useEffect(() => {
    const fetchShortlistedInternships = async () => {
      try {
        const response = await axios.get(`${api}/student/internship/${studentId}/shortlisted-internships`);
        setShortlistedInternships(response.data);
        console.log(response.data);
        
      } catch (err) {
        toast.success('some error occured');
     
      }
    };

    fetchShortlistedInternships();
  }, [studentId]);
  return (
    <div>Chats</div>
  )
}

export default Chats