const Internship = require("./schema/internshipSchema"); // Assuming you have an Internship model

const getInternships = async (req, res) => {
  try {
    let query = {};

    // Work Type (Array of Multiple Values)
    if (req.query.workType) {
      query.workType = { $in: Array.isArray(req.query.workType) ? req.query.workType : [req.query.workType] };
    }

    // Start Month (Find internships starting from selected month)
    if (req.query.startMonth) {
      const startOfMonth = new Date(req.query.startMonth + "-01"); // Convert YYYY-MM to Date
      query.startDate = { $gte: startOfMonth }; // Match internships starting from this month
    }

    // Duration (Exact match)
    if (req.query.duration) {
      query.duration = parseInt(req.query.duration);
    }

    // Stipend Range
    if (req.query.stipendRange) {
      const [min, max] = req.query.stipendRange.split(",").map(Number);
      query.stipend = { $gte: min, $lte: max };
    }

    // Fetch internships
    const internships = await Internship.find(query);
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getInternships };
