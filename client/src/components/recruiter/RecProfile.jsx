import React, { useEffect, useState,useRef } from 'react'
import { FaBuilding, FaPlus,FaTimes, FaPen } from 'react-icons/fa';
import getUserIdFromToken from './auth/authUtilsRecr'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecruiter } from './context/recruiterContext'
import Spinner from '../common/Spinner'
import api from '../common/server_url';
import axios from 'axios';
import { toast } from 'react-toastify';


const RecProfile = () => {

  const fileInputRef=useRef(null);
  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, recruiter } = useRecruiter();
  const token = localStorage.getItem('token');
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isCompanyEdit,setIsCompanyEdit] =useState(false);
  const [companyName,setCompanyName] =useState('');
  console.log(recruiter);

  useEffect(() => {

    if (!token) {
      navigate('/recruiter/login');
      return;
    }
    console.log('id from token', idFromToken);
    console.log('id from params', userId);

    if (idFromToken !== userId) {
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate('/recruiter/login');
      return;
    }

  }, [userId, idFromToken, token]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/get-logo/${idFromToken}`, {
          responseType: 'blob' // Fetching as a blob for image rendering
        });
        console.log('response',response.status)
       
        const logoBlob = new Blob([response.data], { type: response.headers['content-type'] });
        const Url = URL.createObjectURL(logoBlob);
        console.log('logoUrl',Url);
        console.log('logo',logo)
        setLogoUrl(Url);
        
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Logo not found');
          setLogoUrl(null); // Set the logo URL to null if not found
        } else {
          console.error('Error fetching logo:', error);
      }
    };
  }
    fetchLogo();

    return () => {
      if (!logoUrl) {
        URL.revokeObjectURL(logoUrl);
        console.log('Blob URL revoked on cleanup:', logoUrl);  // Optional: Add a log to confirm revocation
      }
    };
  }, [logo]);


  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  }

  const handleFileUpload = async (e) => {
    // if (!logo) return;
    
    const formData = new FormData();
    formData.append('logo', logo);

    try {
      // setUploading(true);
      const response = await axios.post(`${api}/recruiter/upload-logo/${idFromToken}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include token if needed for authorization
        },
      });
      // setUploading(false);
      console.log('Logo uploaded successfully', response.data);
      toast.success('Logo uploaded successfully');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      // setUploading(false);
      console.error('Error uploading logo', error);
    }
  };

  const handleSelect=()=>{
    fileInputRef.current.click();
  }

  const handleCompanySave=async()=>{
  try {
    if(!companyName){
      toast.error('Company name cannot be empty');
     return; 
    }
    axios.put(`${api}/recruiter/api/${idFromToken}/add-company`,{companyName:companyName})
    toast.success('Company added successfully');
    window.location.reload();
  } catch (error) {
    toast.error('Error saving company');
    console.log(error);
  }
  }

  const handleDelete = async() => {
    try{
    await axios.delete(`${api}/recruiter/delete-logo/${idFromToken}`);

    if (logoUrl) {
      URL.revokeObjectURL(logoUrl);
      console.log('Blob URL revoked:', logoUrl);
    }

    setLogo(null);
    setLogoUrl(null);
    toast.error('Logo deleted successfully');
  }catch(error){
    console.error('Error deleting logo', error);
  }
  }
  console.log(companyName);
  return (
    !recruiter ? (
      <Spinner />
    ) : (
      <div className='container mx-auto p-4 mt-[68px] '>
        <div className='border-b flex flex-col items-center'>
          <h1 className="text-3xl font-bold mb-2 text-center">Profile</h1>
          <div className=' w-40 h-auto my-10 flex flex-col space-y-4 items-center'>
            {!logoUrl ? (<FaBuilding className='text-gray-400 w-full h-full' />) : (<img src={logoUrl} alt="Company Logo" className="w-40 h-auto my-2" />)}

            {(!logoUrl && !logo) && <>
              <div className='text-gray-500'>Upload Company logo</div>
              <button onClick={handleSelect} className='w-[70%] inline-block mx-auto bg-gray-300 rounded-lg py-1 px-2 hover:bg-blue-200 hover:scale-105 duration-300'>Select Logo</button>
              <input ref={fileInputRef} onChange={handleFileChange} type="file" className='my-2 hover:cursor-pointer w-full hidden' />
            </>}
            {logo && <button type='submit' onClick={handleFileUpload} className={`  bg-gray-300 rounded-lg py-0 mt-4 px-2 hover:bg-green-200 hover:scale-105 duration-300  `}>UPLOAD</button>}
            {logoUrl && <button className='text-red-500 w-full' onClick={handleDelete}>Delete Logo</button>}
          </div>
          <h1 className=' text-2xl capitalize  text-gray-600'>{recruiter.firstname} {recruiter.lastname}</h1>
          <h1 className=' text-gray-600 '>{recruiter.email}</h1>


          {recruiter.companyName &&
          <div className='flex items-center space-x-3'>
          <h1 className='text-gray-600'>{recruiter.companyName}</h1>
          <FaPen onClick={()=>setIsCompanyEdit(true)} className='w-3 h-3 text-gray-600 hover:cursor-pointer'/>
          </div>
          }
          {!isCompanyEdit && !recruiter.companyName && <button onClick={()=>setIsCompanyEdit(true)} className='text-red-500'>Add Company Name</button>}
          {isCompanyEdit && 
          <>
          <div className='w-1/3 flex space-x-3 items-center'>
          <input type='text' value={companyName} onChange={(e)=>setCompanyName(e.target.value)} className='border-2 border-gray-400 p-2 w-full text-center' />
          <FaTimes onClick={()=>{setIsCompanyEdit(false); setCompanyName('')}} className='hover:cursor-pointer w-5 h-5'/>
            
          </div>
          <button onClick={handleCompanySave} className='px-3 py-1 rounded-lg bg-green-300 hover:bg-green-500 my-2'>Save</button>
          </>
          }
          <h1 className=' text-gray-600 '>Ph no- {recruiter.phone}</h1>
        </div>




      </div>
    )
  );
}

export default RecProfile