import { useEffect, useMemo, useState } from "react";
import "./SavedJobs.css";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary?: number;
  skills?: string[];
  description?: string;
}

interface SavedJob {
  _id: string;
  job: Job;
  createdAt: string;
}

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Jobs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ================================
     FETCH SAVED JOBS
  ================================= */

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please login to view saved jobs.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/saved-jobs/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch saved jobs"
        );
      }

      setSavedJobs(data.data || []);
    } catch (err: any) {
      console.error("Saved jobs error:", err);

      setError(
        err.message || "Unable to load saved jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     REMOVE SAVED JOB
  ================================= */

  const removeSavedJob = async (jobId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/saved-jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to remove saved job"
        );
      }

      setSavedJobs((previous) =>
        previous.filter(
          (savedJob) =>
            savedJob.job._id !== jobId
        )
      );
    } catch (err: any) {
      console.error("Remove saved job error:", err);

      alert(
        err.message ||
          "Unable to remove saved job."
      );
    }
  };

  /* ================================
     FILTER + SEARCH
  ================================= */

  const filteredJobs = useMemo(() => {
    return savedJobs.filter((savedJob) => {
      const job = savedJob.job;

      if (!job) {
        return false;
      }

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.company
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All Jobs" ||
        job.employmentType === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [savedJobs, search, filter]);

  /* ================================
     VIEW JOB
  ================================= */

  const viewJob = (job: Job) => {
    alert(
      `${job.title}\n\n${job.company}\n${job.location}`
    );
  };

  /* ================================
     APPLY
  ================================= */

  const applyToJob = (job: Job) => {
    alert(
      `Application for "${job.title}" will be opened.`
    );
  };

  /* ================================
     FORMAT DATE
  ================================= */

  const formatSavedDate = (
    date: string
  ) => {
    const savedDate = new Date(date);

    if (Number.isNaN(savedDate.getTime())) {
      return "";
    }

    return savedDate.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ================================
     COMPANY INITIAL
  ================================= */

  const getCompanyInitial = (
    company?: string
  ) => {
    if (!company) {
      return "J";
    }

    return company
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="saved-jobs-page">

      {/* ================= HEADER ================= */}

      <div className="saved-jobs-header">

        <div>
          <h1>Saved Jobs</h1>

          <p>
            Jobs you've saved for later. Apply when
            you're ready.
          </p>
        </div>

        <div className="saved-count-card">

          <strong>
            {savedJobs.length}
          </strong>

          <span>
            Saved Jobs
          </span>

        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="saved-search-section">

        <div className="saved-search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search saved jobs..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <select
          className="saved-filter"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        >
          <option>
            All Jobs
          </option>

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

      {/* ================= ERROR ================= */}

      {error && (
        <div
          style={{
            background: "#fff0f0",
            border: "1px solid #ffd5d5",
            color: "#c43d3d",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* ================= MAIN CARD ================= */}

      <div className="saved-jobs-card">

        <div className="saved-jobs-card-header">

          <div>

            <h2>
              Your Saved Jobs
            </h2>

            <p>
              Keep track of opportunities you're
              interested in.
            </p>

          </div>

          <span className="jobs-count">
            {filteredJobs.length} jobs
          </span>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="saved-empty">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading saved jobs...
            </h3>

            <p>
              Please wait while we fetch your
              saved jobs.
            </p>

          </div>

        ) : filteredJobs.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="saved-empty">

            <div className="empty-icon">
              ♡
            </div>

            <h3>
              {savedJobs.length === 0
                ? "No saved jobs yet"
                : "No saved jobs found"}
            </h3>

            <p>
              {savedJobs.length === 0
                ? "Save jobs you're interested in and they will appear here."
                : "Try changing your search or filter."}
            </p>

          </div>

        ) : (

          /* ================= JOB LIST ================= */

          <div className="saved-job-list">

            {filteredJobs.map(
              (savedJob) => {

                const job =
                  savedJob.job;

                return (

                  <div
                    className="saved-job-item"
                    key={savedJob._id}
                  >

                    {/* COMPANY LOGO */}

                    <div className="saved-company-logo">
                      {getCompanyInitial(
                        job.company
                      )}
                    </div>

                    {/* JOB CONTENT */}

                    <div className="saved-job-content">

                      <h3>
                        {job.title}
                      </h3>

                      <div className="saved-company">
                        {job.company}
                      </div>

                      <div className="saved-job-details">

                        <span>
                          📍 {job.location}
                        </span>

                        <span>
                          💼{" "}
                          {job.employmentType}
                        </span>

                        {job.salary && (
                          <span>
                            💰 ₹
                            {job.salary.toLocaleString()}
                          </span>
                        )}

                        <span>
                          ◷ Saved{" "}
                          {formatSavedDate(
                            savedJob.createdAt
                          )}
                        </span>

                      </div>

                      {/* SKILLS */}

                      {job.skills &&
                        job.skills.length > 0 && (

                          <div
                            style={{
                              display: "flex",
                              gap: "7px",
                              flexWrap: "wrap",
                              marginTop: "15px",
                            }}
                          >

                            {job.skills
                              .slice(0, 5)
                              .map(
                                (skill) => (

                                  <span
                                    key={skill}
                                    style={{
                                      background:
                                        "#f0efff",
                                      color:
                                        "#635bff",
                                      padding:
                                        "5px 9px",
                                      borderRadius:
                                        "6px",
                                      fontSize:
                                        "11px",
                                      fontWeight:
                                        "600",
                                    }}
                                  >
                                    {skill}
                                  </span>

                                )
                              )}

                          </div>

                        )}

                      {/* SAVED BADGE */}

                      <div className="saved-job-bottom">

                        <span className="saved-badge">
                          ♥ Saved
                        </span>

                      </div>

                    </div>

                    {/* REMOVE */}

                    <button
                      className="remove-save-btn"
                      onClick={() =>
                        removeSavedJob(
                          job._id
                        )
                      }
                      title="Remove saved job"
                    >
                      ♥
                    </button>

                    {/* ACTIONS */}

                    <div className="saved-job-actions">

                      <button
                        className="view-job-btn"
                        onClick={() =>
                          viewJob(job)
                        }
                      >
                        View Job
                      </button>

                      <button
                        className="apply-now-btn"
                        onClick={() =>
                          applyToJob(job)
                        }
                      >
                        Apply Now
                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default SavedJobs;