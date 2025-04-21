import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InternshipModal = ({ internship, onClose, userId, student, api }) => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState("");
  const [detailedAvailability, setDetailedAvailability] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [assessmentAns, setAssessmentAns] = useState("");

  if (!internship) return null;

  const applyToInternship = async () => {
    try {
      if (
        student.education.length === 0 ||
        student.skills.length === 0 ||
        !student.gender ||
        !student.homeLocation.city ||
        !student.resume
      ) {
        navigate(`/student/profile/${userId}`);
        return;
      }

      if (!availability || !aboutText) {
        toast.error("Please enter all fields");
        return;
      }

      if (availability === "No! Cannot Join immediately" && !detailedAvailability) {
        toast.error("Please provide date of joining");
        return;
      }

      const formData = {
        availability: availability === "Yes! Will join Immediately" ? availability : detailedAvailability,
        aboutText,
        assessmentAns,
      };

      const response = await axios.post(
        `${api}/student/internship/${userId}/apply/${internship._id}`,
        formData
      );

      if (response.status === 200) {
        if (response.data.success) {
          toast.success("You have already applied for this Internship");
        } else {
          toast.success("Successfully applied to the internship");
        }
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to apply");
      }
    } catch (error) {
      toast.error("Error applying to internship");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{internship.title}</h2>
        <p><strong>Company:</strong> {internship.companyName}</p>
        <p><strong>Location:</strong> {internship.location}</p>
        <p><strong>Stipend:</strong> {internship.stipend}</p>
        <p><strong>Duration:</strong> {internship.duration} months</p>
        <p><strong>Skills Required:</strong> {internship.skills.join(", ")}</p>
        <p><strong>Perks:</strong> {internship.perks.join(", ")}</p>
        <p><strong>Description:</strong> {internship.description}</p>

        <div className="apply-section">
          <h3>Apply Now</h3>
          <label>
            Can you join immediately?
            <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="">Select</option>
              <option value="Yes! Will join Immediately">Yes! Will join Immediately</option>
              <option value="No! Cannot Join immediately">No! Cannot Join immediately</option>
            </select>
          </label>

          {availability === "No! Cannot Join immediately" && (
            <label>
              Date of Joining:
              <input
                type="date"
                value={detailedAvailability}
                onChange={(e) => setDetailedAvailability(e.target.value)}
              />
            </label>
          )}

          <label>
            About Yourself:
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Describe why you're a good fit for this internship"
            />
          </label>

          {internship.hasAssessment && (
            <label>
              Assessment Answer:
              <textarea
                value={assessmentAns}
                onChange={(e) => setAssessmentAns(e.target.value)}
                placeholder="Answer the assessment question"
              />
            </label>
          )}

          <button onClick={applyToInternship} className="apply-button">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipModal;
