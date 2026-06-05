// useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (api, userType) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a socket connection when the component mounts
    const socketConnection = io(api, {
      query: { Type: userType },
    });
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected with ID:', socketConnection.id);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, [userType]);

  return socket;
};

export default useSocket;
