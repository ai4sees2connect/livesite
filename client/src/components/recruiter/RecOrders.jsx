import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../common/server_url';
import Spinner from '../common/Spinner';

const RecOrders = () => {
  const { userId } = useParams(); // Get recruiter ID from the route params
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/${userId}/get-orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <Spinner/>
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 min-h-screen mt-20">
      <h1 className="text-xl font-bold mb-4 text-center">Your orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Plan Type</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Transaction Date</th>
                <th className="border border-gray-300 px-4 py-2">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{order.orderId}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{order.planType}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{(order.amount / 100).toFixed(2)} INR</td>
                  <td className={`border border-gray-300 px-4 py-2 text-center ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{new Date(order.transactionDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {order.expirationDate
                      ? new Date(order.expirationDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Utility to style payment status dynamically
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default RecOrders;
