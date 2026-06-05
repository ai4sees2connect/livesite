import { formatDistanceToNow } from "date-fns";

const TimeAgo = ({ date }) => {
  if (!date) return "Unknown";

  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  return <span>{timeAgo}</span>;
};

export default TimeAgo;
