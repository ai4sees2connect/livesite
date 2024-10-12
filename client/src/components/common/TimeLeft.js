import React from 'react';

const TimeLeft=(expirationDate)=>{
  const now = new Date();
  const expiration = new Date(expirationDate);

  // Calculate the difference in milliseconds
  const timeDiff = expiration - now;

  // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // If the expiration date is in the past, return 0
  return daysRemaining > 0 ? daysRemaining : 0;
}

export default TimeLeft;
