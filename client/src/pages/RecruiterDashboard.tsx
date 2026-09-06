import { useEffect, useState } from "react";
import "./RecruiterDashboard.css";


interface Job {
  _id: string;
  title: string;
  company?: string;
  location?: string;
  employmentType?: string;
  salary?: number;
  skills?: string[];
  description?: string;
  experience?: string;
  createdAt?: string;
  recruiter?: string | { _id?: string };
}

interface Applicant {
  _id: string;
  status: string;
  createdAt: string;
  student?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    resume?: string;
    skills?: string[];
  };
  job?: Job;
}

const API = import.meta.env.VITE_API_URL ||"http://localhost:5000/api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [message, setMessage] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
const [postingJob, setPostingJob] = useState(false);
const [editingJobId, setEditingJobId] = useState<string | null>(null);

const [jobForm, setJobForm] = useState({
  title: "",
  company: "",
  location: "",
  employmentType: "Full-Time",
  experience: "",
  salary: "",
  skills: "",
  description: "",
});
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ==========================================
  // FETCH APPLICANTS
  // ==========================================

  const fetchApplicants = async (jobList: Job[]) => {
    try {
      const allApplicants: Applicant[] = [];

      for (const job of jobList) {
        const response = await fetch(
          `${API}/applications/job/${job._id}`,
          {
            headers: authHeaders,
          }
        );

        const result = await response.json();

        if (result.success && result.data) {
          result.data.forEach((application: any) => {
            allApplicants.push({
              ...application,
              job,
            });
          });
        }
      }

      setApplicants(allApplicants);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    }
  };

  // ==========================================
// INITIAL LOAD
// ==========================================

useEffect(() => {
  const loadDashboard = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API}/jobs`, {
        headers: authHeaders,
      });

      const result = await response.json();

      if (result.success) {
        const allJobs = result.data || [];

        let recruiterJobs = allJobs;

        const user = localStorage.getItem("user");

        if (user) {
          try {
            const currentUser = JSON.parse(user);

            const currentRecruiterId =
              currentUser.id || currentUser._id;

            recruiterJobs = allJobs.filter((job: any) => {
              const recruiterId =
                typeof job.recruiter === "object"
                  ? job.recruiter?._id
                  : job.recruiter;

              return (
                String(recruiterId) ===
                String(currentRecruiterId)
              );
            });
          } catch {
            recruiterJobs = allJobs;
          }
        }

        setJobs(recruiterJobs);

        await fetchApplicants(recruiterJobs);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  // ==========================================
// POST NEW JOB
// ==========================================

const handlePostJob = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (!jobForm.title.trim()) {
    setMessage("Job title is required.");
    return;
  }

  if (!jobForm.company.trim()) {
    setMessage("Company name is required.");
    return;
  }

  if (!jobForm.description.trim()) {
    setMessage("Job description is required.");
    return;
  }

  const isEditing = Boolean(editingJobId);

  try {
    setPostingJob(true);
    const jobData = {
      title: jobForm.title.trim(),
      company: jobForm.company.trim(),
      location: jobForm.location.trim() || "Remote",
      employmentType: jobForm.employmentType,
      experience: jobForm.experience.trim(),
      salary: jobForm.salary
        ? Number(jobForm.salary)
        : undefined,
      skills: jobForm.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      description: jobForm.description.trim(),
    };

    const response = await fetch(
      isEditing
        ? `${API}/jobs/${editingJobId}`
        : `${API}/jobs`,
      {
        method: isEditing ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(jobData),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage(
        result.message ||
          (isEditing
            ? "Failed to update job."
            : "Failed to post job.")
      );
      return;
    }

    const updatedJob = result.data;

    if (updatedJob) {
      if (isEditing) {
        setJobs((previous) =>
          previous.map((job) =>
            job._id === editingJobId
              ? updatedJob
              : job
          )
        );
      } else {
        setJobs((previous) => [
          updatedJob,
          ...previous,
        ]);
      }
    }

    setJobForm({
      title: "",
      company: "",
      location: "",
      employmentType: "Full-Time",
      experience: "",
      salary: "",
      skills: "",
      description: "",
    });

    setEditingJobId(null);
    setShowJobForm(false);

    setMessage(
      isEditing
        ? "Job updated successfully!"
        : "Job posted successfully!"
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error) {
    console.error(
      isEditing ? "Update job error:" : "Post job error:",
      error
    );

    setMessage(
      "Unable to connect to the server."
    );
  } finally {
    setPostingJob(false);
  }
};

const handleEditJob = (job: Job) => {
  setEditingJobId(job._id);

  setJobForm({
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    employmentType: job.employmentType || "Full-Time",
    experience: job.experience || "",
    salary: job.salary
      ? String(job.salary)
      : "",
    skills: job.skills
      ? job.skills.join(", ")
      : "",
    description: job.description || "",
  });

  setShowJobForm(true);
};

const handleDeleteJob = async (jobId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API}/jobs/${jobId}`,
      {
        method: "DELETE",
        headers: authHeaders,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage(
        result.message || "Failed to delete job."
      );
      return;
    }

    setJobs((previous) =>
      previous.filter((job) => job._id !== jobId)
    );

    setApplicants((previous) =>
      previous.filter(
        (application) =>
          application.job?._id !== jobId
      )
    );

    setMessage("Job deleted successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error) {
    console.error("Delete job error:", error);
    setMessage(
      "Unable to connect to the server."
    );
  }
};
  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  const updateStatus = async (
    applicationId: string,
    status: string
  ) => {
    try {
      const response = await fetch(
        `${API}/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Failed to update status");
        return;
      }

      setApplicants((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );

      setMessage("Application status updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalJobs = jobs.length;

  const totalApplicants = applicants.length;

  const pendingApplicants = applicants.filter(
    (application) =>
      application.status.toLowerCase() === "pending"
  ).length;

  const shortlistedApplicants = applicants.filter(
    (application) =>
      application.status.toLowerCase() === "shortlisted"
  ).length;

  const hiredApplicants = applicants.filter(
    (application) =>
      application.status.toLowerCase() === "hired"
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="recruiter-page">
        <div className="recruiter-loading">
          Loading recruiter dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-page">
      {/* HEADER */}

      <div className="recruiter-header">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>
            Manage your jobs and review candidates
            efficiently.
          </p>
        </div>

        <div className="recruiter-header-icon">
          💼
        </div>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="recruiter-message">
          {message}
        </div>
      )}

      {/* STATS */}

      <div className="recruiter-stats">
        <div className="recruiter-stat-card">
          <div className="stat-icon purple">💼</div>
          <div>
            <span>Total Jobs</span>
            <strong>{totalJobs}</strong>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="stat-icon blue">👥</div>
          <div>
            <span>Total Applicants</span>
            <strong>{totalApplicants}</strong>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="stat-icon orange">⏳</div>
          <div>
            <span>Pending</span>
            <strong>{pendingApplicants}</strong>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <span>Shortlisted</span>
            <strong>{shortlistedApplicants}</strong>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="stat-icon dark">🎯</div>
          <div>
            <span>Hired</span>
            <strong>{hiredApplicants}</strong>
          </div>
        </div>
      </div>

      {/* MY JOBS */}

      <section className="recruiter-section">
        <div className="recruiter-section-header">
          <div>
            <h2>My Jobs</h2>
            <p>Jobs posted by you</p>
          </div>
           <button
    className="post-job-button"
    onClick={() => setShowJobForm(true)}
  >
    + Post New Job
  </button>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-recruiter">
            <div>📭</div>
            <h3>No jobs posted yet</h3>
            <p>
              Create your first job to start receiving
              applications.
            </p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => {
              const jobApplicants = applicants.filter(
                (application) =>
                  application.job?._id === job._id
              );

              return (
                <div className="recruiter-job-card" key={job._id}>
                  <div className="job-card-top">
                    <div className="company-avatar">
                      {job.company
                        ? job.company.charAt(0).toUpperCase()
                        : "C"}
                    </div>

                    <span className="job-type">
                      {job.employmentType || "Full-Time"}
                    </span>
                  </div>

                  <h3>{job.title}</h3>

                  <p className="job-company">
                    {job.company || "SkillHire Company"}
                  </p>

                  <p className="job-location">
                    📍 {job.location || "Remote"}
                  </p>

                  <div className="job-card-footer">
  <span>
    👥 {jobApplicants.length} applicants
  </span>

  <button
    onClick={() => setSelectedJob(job)}
  >
    View Applicants
  </button>
</div>

<div className="job-card-actions">
  <button
    className="edit-job-button"
    onClick={() => handleEditJob(job)}
  >
    ✏️ Edit
  </button>

  <button
    className="delete-job-button"
    onClick={() => handleDeleteJob(job._id)}
  >
    🗑️ Delete
  </button>
</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ALL APPLICANTS */}

      <section className="recruiter-section">
        <div className="recruiter-section-header">
          <div>
            <h2>Recent Applicants</h2>
            <p>Review and manage candidates</p>
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="empty-recruiter">
            <div>👥</div>
            <h3>No applications yet</h3>
            <p>
              Applications will appear here when students
              apply to your jobs.
            </p>
          </div>
        ) : (
          <div className="applicant-table-wrapper">
            <table className="applicant-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applicants.slice(0, 10).map((application) => {
                  const student = application.student;

                  return (
                    <tr key={application._id}>
                      <td>
                        <div className="candidate-info">
                          <div className="candidate-avatar">
                            {student?.avatar ? (
                              <img
                                src={import.meta.env.VITE_API_URL ||`http://localhost:5000${student.avatar}`}
                                alt=""
                              />
                            ) : (
                              student?.name
                                ?.charAt(0)
                                .toUpperCase() || "S"
                            )}
                          </div>

                          <div>
                            <strong>
                              {student?.name || "Student"}
                            </strong>

                            <small>
                              {student?.email || "No email"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {application.job?.title ||
                          "Job Application"}
                      </td>

                      <td>
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <span
                          className={`status-pill ${application.status.toLowerCase()}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td>
                        <select
                          className="status-select"
                          value={application.status}
                          onChange={(event) =>
                            updateStatus(
                              application._id,
                              event.target.value
                            )
                          }
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Hired">
                            Hired
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
        {/* POST JOB MODAL */}

{showJobForm && (
  <div
    className="recruiter-modal-overlay"
    onClick={() => setShowJobForm(false)}
  >
    <div
      className="recruiter-modal job-form-modal"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <div className="modal-header">
        <div>
          <h2>
  {editingJobId ? "Edit Job" : "Post New Job"}
</h2>
          <p>
            Create a new opportunity for students.
          </p>
        </div>

        <button
          className="modal-close"
          onClick={() =>
            setShowJobForm(false)
          }
        >
          ×
        </button>
      </div>

      <form
        className="job-form"
        onSubmit={handlePostJob}
      >
        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>

            <input
              type="text"
              placeholder="e.g. Software Developer"
              value={jobForm.title}
              onChange={(event) =>
                setJobForm({
                  ...jobForm,
                  title: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Company *</label>

            <input
              type="text"
              placeholder="e.g. SkillHire AI"
              value={jobForm.company}
              onChange={(event) =>
                setJobForm({
                  ...jobForm,
                  company: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              placeholder="e.g. Remote / Noida"
              value={jobForm.location}
              onChange={(event) =>
                setJobForm({
                  ...jobForm,
                  location: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Employment Type</label>

            <select
              value={jobForm.employmentType}
              onChange={(event) =>
                setJobForm({
                  ...jobForm,
                  employmentType:
                    event.target.value,
                })
              }
            >
              <option value="Full-Time">
                Full-Time
              </option>

              <option value="Part-Time">
                Part-Time
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Contract">
                Contract
              </option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Experience</label>

            <input
              type="text"
              placeholder="e.g. 0-2 years"
              value={jobForm.experience}
              onChange={(event) =>
                setJobForm({
                  ...jobForm,
                  experience:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Salary</label>

            <input
              type="number"
              placeholder="e.g. 600000"
              value={jobForm.salary}
              onChange={(event) =>
                setJobForm({
                  ...jobForm,
                  salary: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Skills</label>

          <input
            type="text"
            placeholder="Python, React, MongoDB, SQL"
            value={jobForm.skills}
            onChange={(event) =>
              setJobForm({
                ...jobForm,
                skills: event.target.value,
              })
            }
          />

          <small>
            Separate skills with commas.
          </small>
        </div>

        <div className="form-group">
          <label>Job Description *</label>

          <textarea
            rows={5}
            placeholder="Describe the role, responsibilities and requirements..."
            value={jobForm.description}
            onChange={(event) =>
              setJobForm({
                ...jobForm,
                description:
                  event.target.value,
              })
            }
          />
        </div>

        <div className="job-form-actions">
          <button
            type="button"
            className="cancel-job-button"
            onClick={() =>
              setShowJobForm(false)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-job-button"
            disabled={postingJob}
          >
          {postingJob
            ? editingJobId
              ? "Updating..."
              : "Posting..."
              : editingJobId
              ? "Update Job"
              : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* APPLICANTS MODAL */}

      {selectedJob && (
        <div
          className="recruiter-modal-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="recruiter-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedJob.title}</h2>
                <p>
                  {selectedJob.company || "SkillHire Company"}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </button>
            </div>

<div className="modal-body">
  {applicants.filter(
    (application) =>
      application.job?._id === selectedJob._id
  ).length === 0 ? (
    <div className="modal-empty">
      No applicants for this job yet.
    </div>
  ) : (
    applicants
      .filter(
        (application) =>
          application.job?._id === selectedJob._id
      )
      .map((application) => {
        const student = application.student;

        return (
          <div
            className="modal-applicant"
            key={application._id}
          >
            <div className="modal-candidate">
              <div className="candidate-avatar">
                {student?.avatar ? (
                  <img
                    src={import.meta.env.VITE_API_URL || `http://localhost:5000${student.avatar}`}
                    alt=""
                  />
                ) : (
                  student?.name
                    ?.charAt(0)
                    .toUpperCase() || "S"
                )}
              </div>

              <div className="candidate-details">
                <strong>
                  {student?.name || "Student"}
                </strong>

                <small>
                  📧 {student?.email || "No email"}
                </small>

                {student?.phone && (
                  <small>
                    📱 {student.phone}
                  </small>
                )}
              </div>
            </div>

            {/* SKILLS */}
            {student?.skills &&
              student.skills.length > 0 && (
                <div className="candidate-skills">
                  {student.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

            {/* RESUME */}
            {student?.resume && (
              <a
                className="resume-button"
                href={import.meta.env.VITE_API_URL || `http://localhost:5000${student.resume}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 View Resume
              </a>
            )}

            {/* STATUS */}
            <div className="candidate-status">
              <label>Status</label>

              <select
                className="status-select"
                value={application.status}
                onChange={(event) =>
                  updateStatus(
                    application._id,
                    event.target.value
                  )
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Shortlisted">
                  Shortlisted
                </option>

                <option value="Hired">
                  Hired
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>
          </div>
        );
      })
  )}
</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;