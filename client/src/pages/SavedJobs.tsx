import { useEffect, useState } from "react";
import "./SavedJobs.css";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
interface Job {
  _id: string;
  title: string;
  company?: string;
  description?: string;
  location?: string;
  salary?: number;
  employmentType?: string;
  experience?: string;
  skills?: string[];
  recruiter?: any;
  createdAt?: string;
}

interface SavedJob {
  _id: string;
  student: string;
  job: Job;
  createdAt?: string;
}

const API_URL = `${API}/saved-jobs`;

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const [removingJobId, setRemovingJobId] =
    useState<string | null>(null);

  const [applyingJobId, setApplyingJobId] =
    useState<string | null>(null);

  const [selectedJob, setSelectedJob] =
    useState<Job | null>(null);

  // =========================================
  // FETCH SAVED JOBS
  // =========================================

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/saved-jobs/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error(
          result.message || "Unable to fetch saved jobs"
        );

        setSavedJobs([]);
        return;
      }

      setSavedJobs(result.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch saved jobs:",
        error
      );

      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // REMOVE SAVED JOB
  // =========================================

  const removeSavedJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      setRemovingJobId(jobId);

      const response = await fetch(
        `${API_URL}/saved-jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Unable to remove saved job."
        );
        return;
      }

      // Remove from current list
      setSavedJobs((previous) =>
        previous.filter(
          (saved) =>
            saved.job?._id !== jobId
        )
      );

      // Close modal if this job was open
      if (selectedJob?._id === jobId) {
        setSelectedJob(null);
      }
    } catch (error) {
      console.error(
        "Remove saved job error:",
        error
      );

      alert(
        "Unable to remove saved job."
      );
    } finally {
      setRemovingJobId(null);
    }
  };

  // =========================================
  // APPLY FOR JOB
  // =========================================

  const applyForJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      setApplyingJobId(jobId);

      const response = await fetch(
        `${API_URL}/applications/${jobId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coverLetter: "",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Unable to apply for this job."
        );
        return;
      }

      alert(
        "Application submitted successfully!"
      );

      setSelectedJob(null);
    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      alert(
        "Unable to submit application."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  // =========================================
  // FORMAT SALARY
  // =========================================

  const formatSalary = (
    salary?: number
  ) => {
    if (!salary) {
      return "Not disclosed";
    }

    return `₹${salary.toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================================
  // COMPANY INITIAL
  // =========================================

  const getCompanyInitial = (
    company?: string
  ) => {
    if (!company) {
      return "C";
    }

    return company
      .charAt(0)
      .toUpperCase();
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Recently";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // NO TOKEN
  // =========================================

  if (!localStorage.getItem("token")) {
    return (
      <div className="saved-jobs-page">

        <div className="saved-empty-state">

          <div className="empty-icon">
            🔒
          </div>

          <h2>
            Login Required
          </h2>

          <p>
            Please login to view your
            saved jobs.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="saved-jobs-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="saved-jobs-header">

        <div>
          <span className="saved-label">
            YOUR JOBS
          </span>

          <h1>
            Saved Jobs
          </h1>

          <p>
            Jobs you've saved for
            later.
          </p>
        </div>

        <div className="saved-count">

          <strong>
            {savedJobs.length}
          </strong>

          <span>
            Saved Jobs
          </span>

        </div>

      </div>


      {/* =====================================
          CONTENT
      ===================================== */}

      <main className="saved-jobs-content">

        {/* LOADING */}

        {loading && (
          <div className="saved-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading saved jobs...
            </p>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          savedJobs.length === 0 && (
            <div className="saved-empty-state">

              <div className="empty-icon">
                ♡
              </div>

              <h2>
                No Saved Jobs Yet
              </h2>

              <p>
                When you find a job you like,
                save it here so you can easily
                apply later.
              </p>

            </div>
          )}


        {/* SAVED JOBS */}

        {!loading &&
          savedJobs.length > 0 && (
            <div className="saved-jobs-list">

              {savedJobs.map((saved) => {

                const job = saved.job;

                if (!job) {
                  return null;
                }

                return (
                  <div
                    className="saved-job-card"
                    key={saved._id}
                  >

                    {/* COMPANY LOGO */}

                    <div className="saved-company-logo">
                      {getCompanyInitial(
                        job.company
                      )}
                    </div>


                    {/* JOB INFORMATION */}

                    <div className="saved-job-info">

                      <div className="saved-job-title-row">

                        <h3>
                          {job.title}
                        </h3>

                        <span className="saved-job-badge">
                          SAVED
                        </span>

                      </div>

                      <p className="saved-company">
                        {job.company ||
                          "Company"}
                      </p>


                      {/* META */}

                      <div className="saved-job-meta">

                        <span>
                          📍{" "}
                          {job.location ||
                            "Remote"}
                        </span>

                        <span>
                          💼{" "}
                          {job.employmentType ||
                            "Not specified"}
                        </span>

                        <span>
                          💰{" "}
                          {formatSalary(
                            job.salary
                          )}
                        </span>

                        <span>
                          🎓{" "}
                          {job.experience ||
                            "Not specified"}
                        </span>

                      </div>


                      {/* SKILLS */}

                      <div className="saved-job-skills">

                        {(job.skills || [])
                          .slice(0, 5)
                          .map(
                            (skill) => (
                              <span
                                className="skill-tag"
                                key={skill}
                              >
                                {skill}
                              </span>
                            )
                          )}

                      </div>


                      {/* SAVED DATE */}

                      <p className="saved-date">
                        Saved on{" "}
                        {formatDate(
                          saved.createdAt
                        )}
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="saved-job-actions">

                      <button
                        className="remove-saved-button"
                        disabled={
                          removingJobId ===
                          job._id
                        }
                        onClick={() =>
                          removeSavedJob(
                            job._id
                          )
                        }
                      >
                        {removingJobId ===
                        job._id
                          ? "Removing..."
                          : "♥ Saved"}
                      </button>

                      <button
                        className="saved-view-button"
                        onClick={() =>
                          setSelectedJob(
                            job
                          )
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </main>


      {/* =====================================
          JOB DETAILS MODAL
      ===================================== */}

      {selectedJob && (
        <div
          className="saved-modal-overlay"
          onClick={() =>
            setSelectedJob(null)
          }
        >

          <div
            className="saved-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="saved-modal-close"
              onClick={() =>
                setSelectedJob(null)
              }
            >
              ×
            </button>


            {/* HEADER */}

            <div className="saved-modal-header">

              <div className="saved-modal-logo">
                {getCompanyInitial(
                  selectedJob.company
                )}
              </div>

              <div>

                <h2>
                  {selectedJob.title}
                </h2>

                <p>
                  {selectedJob.company ||
                    "Company"}
                </p>

              </div>

            </div>


            {/* META */}

            <div className="saved-modal-meta">

              <span>
                📍{" "}
                {selectedJob.location ||
                  "Remote"}
              </span>

              <span>
                💼{" "}
                {selectedJob.employmentType ||
                  "Not specified"}
              </span>

              <span>
                💰{" "}
                {formatSalary(
                  selectedJob.salary
                )}
              </span>

              <span>
                🎓{" "}
                {selectedJob.experience ||
                  "Not specified"}
              </span>

            </div>


            {/* DESCRIPTION */}

            <div className="saved-modal-section">

              <h3>
                Job Description
              </h3>

              <p>
                {selectedJob.description ||
                  "No job description available."}
              </p>

            </div>


            {/* SKILLS */}

            <div className="saved-modal-section">

              <h3>
                Required Skills
              </h3>

              <div className="saved-modal-skills">

                {(selectedJob.skills || [])
                  .map((skill) => (
                    <span
                      className="skill-tag"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}

              </div>

            </div>


            {/* ACTIONS */}

            <div className="saved-modal-actions">

              <button
                className="modal-remove-button"
                disabled={
                  removingJobId ===
                  selectedJob._id
                }
                onClick={() =>
                  removeSavedJob(
                    selectedJob._id
                  )
                }
              >
                {removingJobId ===
                selectedJob._id
                  ? "Removing..."
                  : "♥ Remove Saved"}
              </button>

              <button
                className="modal-apply-button"
                disabled={
                  applyingJobId ===
                  selectedJob._id
                }
                onClick={() =>
                  applyForJob(
                    selectedJob._id
                  )
                }
              >
                {applyingJobId ===
                selectedJob._id
                  ? "Submitting..."
                  : "Apply Now"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default SavedJobs;