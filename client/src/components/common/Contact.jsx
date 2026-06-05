import React, {useEffect,useState} from 'react';
import contact_pic from '../../images/contact_pic.jpeg';
import findUser from '../common/UserDetection.js'
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import getUserIdFromToken from '../student/auth/authUtils.js';
import api from './server_url.js';
import Spinner from '../common/Spinner.jsx'

const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    query: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [loading,setLoading]=useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(`${api}/send-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormMessage('Your query has been sent successfully.');
        setFormData({ name: '', phone: '', email: '', query: '' });
      } else {
        setFormMessage('Failed to send your query. Please try again.');
      }
    } catch (error) {
      setFormMessage('An error occurred. Please try again later.');
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const idFromToken = getUserIdFromToken();
  const token = localStorage.getItem("token");

  const handleUserNavigate=async()=>{
    const decoded = jwtDecode(token);
    const userType = decoded.userType;
    console.log(userType)
    if(userType==='Student'){
      navigate(`/student/dashboard/${idFromToken}`)
      return;
    }

    if(userType==='Recruiter'){
      navigate(`/recruiter/dashboard/${idFromToken}`)
      return;
    }
  }

  return (
    <div className="flex flex-col items-center bg-gray-50">
      <nav className="w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center flex justify-center space-x-5">
          {token && <button onClick={handleUserNavigate} className='text-xl font-bold text-gray-700'>Home</button>}
          {!token && <Link to='/' className='text-xl font-bold text-gray-700 '>Home</Link>}
          <button className="text-xl font-bold text-blue-600 ">Contact Us</button>
        </div>
      </nav>

      {/* Image Section */}
      <div className="w-full ">
        <img src={contact_pic} alt="Contact" className="w-full h-[400px] object-cover" />
      </div>

      {/* Contact Information Section */}
      <div className="p-8 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Phone- </span>+91 8867583329
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Email ID:</span> connect@ai4sees.com
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Address:</span> 9th Main Road, Vysya Bank Colony, New Gurappana Palya, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka
        </p>
       
      </div>

      <div className="p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">Ask Your Queries</h2>
        {loading?(<Spinner/>):(<form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-lg font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">Query</label>
            <textarea
              name="query"
              value={formData.query}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded h-32"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2  border border-black bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>)}
        
      </div>
    </div>
  );
};

export default Contact;
