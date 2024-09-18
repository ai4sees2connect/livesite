import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../common/server_url';

const RecChatRoom = () => {

  const {recruiterId}=useParams();
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  console.log(recruiterId)


  useEffect(() => {
    // Fetch the list of shortlisted students when the component mounts
    const fetchShortlistedStudents = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/${recruiterId}/fetch-all-shortlisted`);
        setShortlistedStudents(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching shortlisted students:', error);
      }
    };

    fetchShortlistedStudents();
  }, [recruiterId]);


  return (
    <div className="flex justify-end h-[80vh] border border-black mt-20 mx-8 relative">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed left-10 top-30 w-[30%] bg-gray-100 p-4 overflow-y-auto  h-[70vh]">
        <h2 className="text-xl font-semibold mb-4">Shortlisted Students</h2>
        <ul className="space-y-2">
          {/* List of students */}
          <li className="p-2 bg-white rounded shadow cursor-pointer hover:bg-purple-100">
            Student 1
          </li>
          <li className="p-2 bg-white rounded shadow cursor-pointer hover:bg-purple-100">
            Student 2
          </li>
          <li className="p-2 bg-white rounded shadow cursor-pointer hover:bg-purple-100">
            Student 3
          </li>
          {/* Add more students here */}
        </ul>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="w-[65%] p-4 flex flex-col border border-red-500">
        <div className="flex-grow bg-white p-4 rounded-lg shadow overflow-y-auto">
          {/* Chat messages */}
          <div className="flex flex-col space-y-4">
            <div className="p-2 bg-gray-200 rounded max-w-md">
              <strong>Student:</strong> Hi, I'm interested in the internship.
            </div>
            <div className="p-2 bg-purple-200 rounded max-w-md self-end">
              <strong>Recruiter:</strong> Great! Let's discuss further.
            </div>
            {/* More messages */}
          </div>
        </div>

        {/* Chat input */}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Type a message..."
          />
        </div>
      </div>

    </div>
  );
};

export default RecChatRoom;
