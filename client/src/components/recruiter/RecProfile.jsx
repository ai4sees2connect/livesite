import React, { useEffect, useState, useRef } from 'react'
import { FaBuilding, FaPlus, FaTimes, FaPen, FaPaperclip } from 'react-icons/fa';
import getUserIdFromToken from './auth/authUtilsRecr'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecruiter } from './context/recruiterContext'
import Spinner from '../common/Spinner'
import api from '../common/server_url';
import axios from 'axios';
import { toast } from 'react-toastify';
import TimeAgo from '../common/TimeAgo'


const RecProfile = () => {

  const fileInputRef = useRef(null);
  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, recruiter } = useRecruiter();
  const token = localStorage.getItem('token');
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isCompanyEdit, setIsCompanyEdit] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyUrl, setCompanyUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

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
        console.log('response', response.status)

        const logoBlob = new Blob([response.data], { type: response.headers['content-type'] });
        const Url = URL.createObjectURL(logoBlob);
        console.log('logoUrl', Url);
        console.log('logo', logo)
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

  useEffect(() => {
    if (recruiter?.companyCertificate?.data) {
      const byteArray = new Uint8Array(recruiter.companyCertificate.data.data);
      const blob = new Blob([byteArray], { type: recruiter.companyCertificate.contentType });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  }, [recruiter]);





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

  const handleSelect = () => {
    fileInputRef.current.click();
  }

  const handleCompanySave = async () => {
    try {
      if (!companyName) {
        toast.error('Company name cannot be empty');
        return;
      }
      axios.put(`${api}/recruiter/api/${idFromToken}/add-company`, { companyName: companyName })
      toast.success('Company added successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Error saving company');
      console.log(error);
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${api}/recruiter/delete-logo/${idFromToken}`);

      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
        console.log('Blob URL revoked:', logoUrl);
      }

      setLogo(null);
      setLogoUrl(null);
      toast.error('Logo deleted successfully');
    } catch (error) {
      console.error('Error deleting logo', error);
    }
  }
  console.log(companyName);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUrlInputChange = (e) => {
    setCompanyUrl(e.target.value);
  };

  const handleSubmit = async () => {
    // Check if either the company URL or the selected file is provided
    if (!companyUrl && !selectedFile) {
      toast.error('Please provide either a company website URL or upload a certificate.');
      return;
    }

    try {
      let formData = new FormData();

      // Check if the company URL is provided
      if (companyUrl) {
        formData.append('companyWebsite', companyUrl);
      }

      // Check if the selected file is provided
      if (selectedFile) {
        formData.append('companyCertificate', selectedFile);
      }

      // Make an API call to submit the data
      const response = await axios.post(`${api}/recruiter/${idFromToken}/upload-details`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Details submitted successfully!');
        // Reset the form after successful submission
        setCompanyUrl('');
        setSelectedFile(null);
        window.location.reload();
      } else {
        toast.error('Failed to submit details. Please try again.');
      }

    } catch (error) {
      toast.error('An error occurred during submission. Please try again.');
      console.error(error);
    }
  };

  console.log(recruiter);

  return (
    !recruiter ? (
      <Spinner />
    ) : (
      <div className='container mx-auto p-4 mt-[68px] '>
        <div className='border-b flex flex-col items-center space-y-3'>
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
              <FaPen onClick={() => setIsCompanyEdit(true)} className='w-3 h-3 text-gray-600 hover:cursor-pointer' />
            </div>
          }
          {!isCompanyEdit && !recruiter.companyName && <button onClick={() => setIsCompanyEdit(true)} className='text-red-500'>Add Company Name</button>}
          {isCompanyEdit &&
            <>
              <div className='w-1/3 flex space-x-3 items-center'>
                <input type='text' value={companyName} onChange={(e) => setCompanyName(e.target.value)} className='border-2 border-gray-400 p-2 w-full text-center' />
                <FaTimes onClick={() => { setIsCompanyEdit(false); setCompanyName('') }} className='hover:cursor-pointer w-5 h-5' />

              </div>
              <button onClick={handleCompanySave} className='px-3 py-1 rounded-lg bg-green-300 hover:bg-green-500 my-2'>Save</button>
            </>
          }
          <h1 className=' text-gray-600 '>Ph no- {recruiter.phone}</h1>

          {!recruiter.companyWebsite.link && !recruiter.companyCertificate.data && <div className='flex flex-col space-y-3 justify-center'>
            {/* Trigger button to open popup */}
            <p className='text-red-400'>Upload company's incorporation certificate or Official website link</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
            >
              Upload PDF or Enter URL
            </button>

            {/* Modal Popup */}
            {isModalOpen && (
              <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 mt-10" >
                <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] flex flex-col space-y-4 justify-between relative">
                  {/* File Upload Section */}
                  <FaTimes className='absolute right-3 top-3 text-red-500 hover:cursor-pointer' onClick={() => { setIsModalOpen(false); setSelectedFile(null); setCompanyUrl('') }} />
                  <div className='flex justify-center items-center'>
                    {!companyUrl && <div className="w-[45%] flex flex-col items-center justify-center">
                      <input
                        id="fileinput"
                        type="file"
                        onChange={handleFileInput}
                        className="hidden"
                        accept=".pdf"
                      />
                      <label
                        htmlFor="fileinput"
                        className="text-blue-500 text-lg hover:cursor-pointer hover:scale-105 duration-300">
                        <span>Upload PDF</span>
                      </label>
                      {selectedFile && <p>{selectedFile.name}</p>}
                    </div>}

                    {/* OR Divider */}
                    {!selectedFile && !companyUrl && <div className="w-[10%] flex items-center justify-center">
                      <span className="text-gray-400">OR</span>
                    </div>}

                    {/* URL Input Section */}
                    {!selectedFile && <div className="w-[45%] flex flex-col items-center">
                      <input
                        type="text"
                        placeholder="Enter company's website URL"
                        onChange={handleUrlInputChange}
                        className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500"
                      />

                    </div>}
                  </div>
                  <button
                    onClick={() => { setIsModalOpen(false); handleSubmit() }}
                    className="bg-green-500 text-white mt-2 py-2 px-4 rounded hover:bg-green-700 "
                  >
                    Submit
                  </button>
                </div>

              </div>
            )}
          </div>}

          {pdfUrl && (
            <>
              <a
                href={pdfUrl}
                download={recruiter.companyCertificate.filename}
                className="text-blue-500"
              >
                Download Company Incorporation Certificate
              </a>
              <p className='text-gray-600'>({`Uploaded ${TimeAgo(recruiter.companyCertificate.uploadedDate)}`})</p>
              <p className='text-gray-600'>Verification: 
                 <span className={`${recruiter.companyCertificate.status === 'pending'
                  ? 'text-yellow-500'
                  : recruiter.companyCertificate.status === 'Verified'
                    ? 'text-green-500'
                    : recruiter.companyCertificate.status === 'Rejected'
                      ? 'text-red-500'
                      : ''
                }`}>{recruiter.companyCertificate.status}</span></p>
              <p className='text-red-400'>We will verify your certificate shortly!</p>
              <p className='text-red-400 text-center'>(Estimated time-24hrs)</p>
            </>
          )}

          {recruiter.companyWebsite.link && <div>
            <p className='text-blue-500 text-center'>{recruiter.companyWebsite.link}</p>
            <p>{recruiter.companyWebsite.status}</p>
            <p className='text-red-400'>We will verify your provided link shortly!</p>
            <p className='text-red-400 text-center'>(Estimated time-24hrs)</p>
          </div>}


        </div>




      </div>
    )
  );
}

export default RecProfile