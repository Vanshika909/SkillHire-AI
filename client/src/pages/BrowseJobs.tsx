import { useEffect, useMemo, useState } from "react";
import "./BrowseJobs.css";

interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: number;
  employmentType: "Full-Time" | "Part-Time" | "Internship" | "Remote";
  experience: string;
  skills: string[];
  recruiter: string;
  createdAt: string;
}

interface JobsResponse {
  success: boolean;
  count: number;
  total: number;
  data: Job[];
}

function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experience, setExperience] = useState("");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(
  new Set()
);
const [savingJobId, setSavingJobId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState("Best Match");

  // =========================
// FETCH SAVED JOBS
// =========================

const fetchSavedJobs = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/saved-jobs/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch saved jobs");
    }

    const result = await response.json();

    if (result.success) {
      const ids = new Set<string>(
        result.data.map((item: any) => item.job?._id)
      );

      setSavedJobIds(ids);
    }
  } catch (err) {
    console.error("Fetch saved jobs error:", err);
  }
};

  // =========================
  // FETCH JOBS
  // =========================

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/jobs");

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result: JobsResponse = await response.json();

      if (result.success) {
        setJobs(result.data);
      } else {
        setError("Unable to load jobs.");
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError(
        "Unable to connect to the server. Make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
// SAVE / UNSAVE JOB
// =========================

const toggleSaveJob = async (jobId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login as a student to save jobs.");
    return;
  }

  const isSaved = savedJobIds.has(jobId);

  try {
    setSavingJobId(jobId);

    const response = await fetch(
      isSaved
        ? `http://localhost:5000/api/saved-jobs/${jobId}`
        : `http://localhost:5000/api/saved-jobs/${jobId}`,
      {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to update saved job"
      );
    }

    setSavedJobIds((previous) => {
      const updated = new Set(previous);

      if (isSaved) {
        updated.delete(jobId);
      } else {
        updated.add(jobId);
      }

      return updated;
    });
  } catch (err: any) {
    console.error("Save job error:", err);

    alert(
      err.message || "Something went wrong while saving the job."
    );
  } finally {
    setSavingJobId(null);
  }
};
  // =========================
  // FILTER JOBS
  // =========================

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    const searchText = search.toLowerCase().trim();
    const locationText = location.toLowerCase().trim();

    if (searchText) {
      result = result.filter((job) => {
        const searchableText = [
          job.title,
          job.company,
          job.description,
          ...job.skills,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
    }

    if (locationText) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(locationText)
      );
    }

    if (employmentType) {
      result = result.filter(
        (job) => job.employmentType === employmentType
      );
    }

    if (experience) {
      result = result.filter((job) =>
        job.experience.toLowerCase().includes(experience.toLowerCase())
      );
    }

    if (sortBy === "Newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    if (sortBy === "Salary: High to Low") {
      result.sort((a, b) => b.salary - a.salary);
    }

    if (sortBy === "Salary: Low to High") {
      result.sort((a, b) => a.salary - b.salary);
    }

    return result;
  }, [
    jobs,
    search,
    location,
    employmentType,
    experience,
    sortBy,
  ]);

  // =========================
  // APPLY FOR JOB
  // =========================

  const applyForJob = async (jobId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a student before applying.");
      return;
    }

    try {
      setApplyingJobId(jobId);

      const response = await fetch(
        `http://localhost:5000/api/applications/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coverLetter: "",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit application"
        );
      }

      alert("Application submitted successfully! 🎉");

      setSelectedJob(null);
    } catch (err: any) {
      console.error("Application error:", err);

      alert(
        err.message ||
          "Something went wrong while submitting your application."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setEmploymentType("");
    setExperience("");
    setSortBy("Best Match");
  };

  // =========================
  // FORMAT SALARY
  // =========================

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // =========================
  // JOB AGE
  // =========================

  const getJobAge = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();

    const hours = Math.floor(
      (now - created) / (1000 * 60 * 60)
    );

    if (hours < 1) {
      return "Posted just now";
    }

    if (hours < 24) {
      return `Posted ${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);

    return `Posted ${days} day${days === 1 ? "" : "s"} ago`;
  };

  return (
    <div className="browse-page">

      {/* ================= HEADER ================= */}

      <section className="browse-hero">
        <div>
          <h1>
            Find Your Next{" "}
            <span>Breakthrough</span>
          </h1>

          <p>
            Discover AI-curated opportunities matching your unique
            skills.
          </p>
        </div>

        <div className="search-area">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Job title, keywords, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="search-box location-box">
            <span>⌖</span>

            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button
            className="search-button"
            onClick={() => {
              // Filtering happens automatically.
            }}
          >
            Search Jobs
          </button>

        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="jobs-layout">

        {/* ================= SIDEBAR FILTERS ================= */}

        <aside className="filters-card">

          <div className="filters-header">
            <h3>Filters</h3>

            <button onClick={clearFilters}>
              Clear all
            </button>
          </div>

          {/* Employment Type */}

          <div className="filter-section">

            <h4>EMPLOYMENT TYPE</h4>

            <label>
              <input
                type="radio"
                name="employment"
                checked={employmentType === ""}
                onChange={() => setEmploymentType("")}
              />
              <span>All Jobs</span>
            </label>

            <label>
              <input
                type="radio"
                name="employment"
                checked={employmentType === "Full-Time"}
                onChange={() =>
                  setEmploymentType("Full-Time")
                }
              />
              <span>Full-Time</span>
            </label>

            <label>
              <input
                type="radio"
                name="employment"
                checked={employmentType === "Part-Time"}
                onChange={() =>
                  setEmploymentType("Part-Time")
                }
              />
              <span>Part-Time</span>
            </label>

            <label>
              <input
                type="radio"
                name="employment"
                checked={employmentType === "Internship"}
                onChange={() =>
                  setEmploymentType("Internship")
                }
              />
              <span>Internship</span>
            </label>

            <label>
              <input
                type="radio"
                name="employment"
                checked={employmentType === "Remote"}
                onChange={() =>
                  setEmploymentType("Remote")
                }
              />
              <span>Remote</span>
            </label>

          </div>

          {/* Experience */}

          <div className="filter-section">

            <h4>EXPERIENCE LEVEL</h4>

            <label>
              <input
                type="radio"
                name="experience"
                checked={experience === ""}
                onChange={() => setExperience("")}
              />
              <span>All Levels</span>
            </label>

            <label>
              <input
                type="radio"
                name="experience"
                checked={experience === "0-2"}
                onChange={() => setExperience("0-2")}
              />
              <span>Entry Level</span>
            </label>

            <label>
              <input
                type="radio"
                name="experience"
                checked={experience === "2-5"}
                onChange={() => setExperience("2-5")}
              />
              <span>Mid Level</span>
            </label>

            <label>
              <input
                type="radio"
                name="experience"
                checked={experience === "5+"}
                onChange={() => setExperience("5+")}
              />
              <span>Senior Level</span>
            </label>

          </div>

          {/* Quick Info */}

          <div className="ai-filter-box">
            <div className="ai-icon">✦</div>

            <div>
              <strong>AI Matching</strong>

              <p>
                AI recommendations will appear based on your
                skills and profile.
              </p>
            </div>
          </div>

        </aside>

        {/* ================= JOB RESULTS ================= */}

        <main className="jobs-content">

          <div className="results-header">

            <div>
              <strong>
                Showing {filteredJobs.length} jobs
              </strong>
            </div>

            <div className="sort-container">

              <span>Sort by:</span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option>Best Match</option>
                <option>Newest</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>

            </div>

          </div>

          {/* Loading */}

          {loading && (
            <div className="status-box">
              <div className="spinner"></div>
              <p>Finding the best jobs for you...</p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="error-box">
              <div className="error-icon">!</div>

              <h3>Unable to load jobs</h3>

              <p>{error}</p>

              <button onClick={fetchJobs}>
                Try Again
              </button>
            </div>
          )}

          {/* No jobs */}

          {!loading &&
            !error &&
            filteredJobs.length === 0 && (
              <div className="empty-box">

                <div className="empty-icon">
                  🔍
                </div>

                <h3>No jobs found</h3>

                <p>
                  Try changing your search or filters.
                </p>

                <button onClick={clearFilters}>
                  Clear Filters
                </button>

              </div>
            )}

          {/* Jobs */}

          {!loading &&
            !error &&
            filteredJobs.map((job) => (
              <article
                className="job-card"
                key={job._id}
              >

                {/* Match Badge */}

                <div className="match-badge">
                  ✦ AI Match
                </div>

                {/* Job Header */}

                <div className="job-main">

                  <div className="company-logo">
                    {job.company
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="job-title-area">

                    <h2>{job.title}</h2>

                    <p className="company-name">
                      {job.company}
                    </p>

                  </div>

                </div>

                {/* Job Info */}

                <div className="job-info">

                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💼 {job.employmentType}
                  </span>

                  <span>
                    💰 {formatSalary(job.salary)}
                  </span>

                  <span>
                    🎓 {job.experience}
                  </span>

                </div>

                {/* Skills */}

                <div className="skills">

                  {job.skills.map((skill) => (
                    <span
                      className="skill-tag"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}

                </div>

                {/* Footer */}

                <div className="job-footer">

                  <span className="posted-time">
                    {getJobAge(job.createdAt)}
                  </span>

                  <div className="job-actions">

                    <button
                        className={`save-button ${
                          savedJobIds.has(job._id) ? "saved" : ""
                        }`}
                        title={
                          savedJobIds.has(job._id)
                            ? "Remove from saved jobs"
                            : "Save Job"
                        }
                        disabled={savingJobId === job._id}
                        onClick={() => toggleSaveJob(job._id)}
                        >                     
                        {savedJobIds.has(job._id) ? "♥" : "♡"}
                      </button>

                    <button
                      className="view-button"
                      onClick={() =>
                        setSelectedJob(job)
                      }
                    >
                      View Details
                    </button>

                    <button
                      className="apply-button"
                      disabled={
                        applyingJobId === job._id
                      }
                      onClick={() =>
                        applyForJob(job._id)
                      }
                    >
                      {applyingJobId === job._id
                        ? "Applying..."
                        : "Apply Now"}
                    </button>

                  </div>

                </div>

              </article>
            ))}

        </main>

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
                .charAt(0)
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
                {selectedJob.description}
              </p>

            </div>

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

            <button
              className="modal-apply-button"
              disabled={
                applyingJobId ===
                selectedJob._id
              }
              onClick={() =>
                applyForJob(selectedJob._id)
              }
            >
              {applyingJobId === selectedJob._id
                ? "Submitting Application..."
                : "Apply Now"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default BrowseJobs;