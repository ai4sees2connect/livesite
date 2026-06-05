const calculateDaysRemaining = (activationDate) => {
  const currentDate = new Date();
  const activation = new Date(activationDate);
  
  // Calculate the difference in milliseconds
  const timeDiff = activation.getTime() + (30 * 24 * 60 * 60 * 1000) - currentDate.getTime(); // 30 days after activation

  // Calculate the difference in days
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

  return daysRemaining > 0 ? daysRemaining : 0; // Prevent negative values
};

export default calculateDaysRemaining;