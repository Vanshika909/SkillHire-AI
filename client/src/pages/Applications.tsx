import { useEffect, useState } from "react";
import "./Applications.css";
const API = import.meta.env.PROD
  ? "https://skillhire-ai-backend.onrender.com/api"
  : "http://localhost:5000/api";
interface Job {
  _id: string;
  title: string;
  company?: string;
  location?: string;
  employmentType?: string;
  salary?: number;
  description?: string;
  experience?: string;
  skills?: string[];
}

interface Application {
  _id: string;
  job: Job | string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  // =========================
  // FETCH APPLICATIONS
  // =========================

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load applications."
        );
      }

      setApplications(result.data || []);
    } catch (err: any) {
      console.error("Fetch applications error:", err);

      setError(
        err.message || "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================
  // WITHDRAW APPLICATION
  // =========================

  const withdrawApplication = async (id: string) => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmWithdraw) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setWithdrawingId(id);

      const response = await fetch(
        `${API}/applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to withdraw application."
        );
      }

      setApplications((prev) =>
        prev.filter(
          (application) => application._id !== id
        )
      );

      alert("Application withdrawn successfully.");
    } catch (err: any) {
      console.error("Withdraw error:", err);

      alert(
        err.message ||
          "Server error while withdrawing application."
      );
    } finally {
      setWithdrawingId(null);
    }
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return "status-shortlisted";

      case "hired":
      case "accepted":
        return "status-hired";

      case "rejected":
        return "status-rejected";

      case "withdrawn":
        return "status-withdrawn";

      default:
        return "status-pending";
    }
  };

  // =========================
  // JOB HELPERS
  // =========================

  const getJob = (job: Job | string): Job | null => {
    if (typeof job === "object") {
      return job;
    }

    return null;
  };

  const getJobTitle = (job: Job | string) => {
    const jobData = getJob(job);

    return jobData?.title || "Job Application";
  };

  const getCompany = (job: Job | string) => {
    const jobData = getJob(job);

    return jobData?.company || "SkillHire AI";
  };

  const getLocation = (job: Job | string) => {
    const jobData = getJob(job);

    return jobData?.location || "Remote";
  };

  const getEmploymentType = (job: Job | string) => {
    const jobData = getJob(job);

    return jobData?.employmentType || "Full-Time";
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return "Not specified";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // =========================
  // COUNTS
  // =========================

  const pendingCount = applications.filter(
    (app) => app.status.toLowerCase() === "pending"
  ).length;

  const shortlistedCount = applications.filter(
    (app) => app.status.toLowerCase() === "shortlisted"
  ).length;

  const hiredCount = applications.filter(
    (app) =>
      app.status.toLowerCase() === "hired" ||
      app.status.toLowerCase() === "accepted"
  ).length;

  return (
    <div className="applications-page">

      {/* ================= HEADER ================= */}

      <div className="applications-header">
        <div>
          <h1>My Applications</h1>

          <p>
            Track and manage all your job applications
            in one place.
          </p>
        </div>

        <div className="application-count">
          <span>{applications.length}</span>
          <small>Total Applications</small>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="application-stats">

        <div className="application-stat-card">
          <div className="stat-icon applied-icon">
            ▤
          </div>

          <div>
            <span>Applied</span>
            <strong>{applications.length}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="stat-icon pending-icon">
            ◷
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="stat-icon shortlisted-icon">
            ✓
          </div>

          <div>
            <span>Shortlisted</span>
            <strong>{shortlistedCount}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="stat-icon hired-icon">
            ★
          </div>

          <div>
            <span>Hired</span>
            <strong>{hiredCount}</strong>
          </div>
        </div>

      </div>

      {/* ================= APPLICATION HISTORY ================= */}

      <div className="applications-section">

        <div className="section-title">

          <div>
            <h2>Application History</h2>

            <p>
              View the current status of your applications.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchApplications}
            disabled={loading}
          >
            ↻ {loading ? "Refreshing..." : "Refresh"}
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <div className="applications-message">
            Loading applications...
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="applications-message error-message">
            <p>{error}</p>

            <button onClick={fetchApplications}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="empty-applications">

              <div className="empty-icon">
                ▤
              </div>

              <h3>No applications yet</h3>

              <p>
                Start applying for jobs and your
                applications will appear here.
              </p>

            </div>
          )}

        {/* Application List */}

        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="application-list">

              {applications.map((application) => {

                const job = getJob(application.job);

                return (
                  <div
                    className="application-card"
                    key={application._id}
                  >

                    {/* Company Logo */}

                    <div className="company-logo">
                      {getCompany(application.job)
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* Job Information */}

                    <div className="application-info">

                      <div className="application-main">

                        <h3>
                          {getJobTitle(application.job)}
                        </h3>

                        <span className="company-name">
                          {getCompany(application.job)}
                        </span>

                      </div>

                      <div className="job-details">

                        <span>
                          📍 {getLocation(application.job)}
                        </span>

                        <span>
                          💼{" "}
                          {getEmploymentType(
                            application.job
                          )}
                        </span>

                        <span>
                          📅 Applied{" "}
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <div className="application-id">
                        Application ID:{" "}
                        {application._id}
                      </div>

                    </div>

                    {/* Status + Actions */}

                    <div className="application-actions">

                      <span
                        className={`application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                      <div className="action-buttons">

                        <button
                          className="view-job-button"
                          onClick={() => {
                            if (job) {
                              setSelectedJob(job);
                            }
                          }}
                        >
                          View Job
                        </button>

                        {application.status.toLowerCase() ===
                          "pending" && (
                          <button
                            className="withdraw-button"
                            disabled={
                              withdrawingId ===
                              application._id
                            }
                            onClick={() =>
                              withdrawApplication(
                                application._id
                              )
                            }
                          >
                            {withdrawingId ===
                            application._id
                              ? "Withdrawing..."
                              : "Withdraw"}
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </div>

      {/* ================= JOB DETAILS MODAL ================= */}

      {selectedJob && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedJob(null)}
        >

          <div
            className="job-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-modal"
              onClick={() =>
                setSelectedJob(null)
              }
            >
              ×
            </button>

            <div className="modal-logo">
              {selectedJob.company
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <h2>{selectedJob.title}</h2>

            <p className="modal-company">
              {selectedJob.company}
            </p>

            <div className="modal-details">

              <div>
                <strong>Location</strong>
                <span>
                  📍 {selectedJob.location}
                </span>
              </div>

              <div>
                <strong>Salary</strong>
                <span>
                  💰 {formatSalary(selectedJob.salary)}
                </span>
              </div>

              <div>
                <strong>Employment</strong>
                <span>
                  💼 {selectedJob.employmentType}
                </span>
              </div>

              <div>
                <strong>Experience</strong>
                <span>
                  🎓 {selectedJob.experience}
                </span>
              </div>

            </div>

            <div className="modal-section">

              <h3>Job Description</h3>

              <p>
                {selectedJob.description ||
                  "No description available."}
              </p>

            </div>

            {selectedJob.skills &&
              selectedJob.skills.length > 0 && (
                <div className="modal-section">

                  <h3>Required Skills</h3>

                  <div className="skills modal-skills">

                    {selectedJob.skills.map(
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

                </div>
              )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Applications;