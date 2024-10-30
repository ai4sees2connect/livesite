function formatDateWithOrdinal(date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  
  // Add ordinal suffix to the day
  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // covers 11th to 20th
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
}

export default formatDateWithOrdinal;