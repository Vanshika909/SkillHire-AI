import { useEffect, useMemo, useState } from "react";
import "./BrowseJobs.css";

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

const API_URL = "http://localhost:5000/api";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experience, setExperience] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(
    new Set()
  );

  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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

      const response = await fetch(`${API_URL}/jobs`);

      const result = await response.json();

      if (result.success) {
        setJobs(result.data || []);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH SAVED JOBS
  // =========================
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(`${API_URL}/saved-jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        const ids = new Set<string>();

        (result.data || []).forEach((saved: any) => {
          if (saved.job?._id) {
            ids.add(saved.job._id);
          }
        });

        setSavedJobIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
    }
  };

  // =========================
  // SAVE / UNSAVE JOB
  // =========================
  const toggleSaveJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      setSavingJobId(jobId);

      const isSaved = savedJobIds.has(jobId);

      const response = await fetch(
        `${API_URL}/saved-jobs/${jobId}`,
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
        alert(result.message || "Something went wrong.");
        return;
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
    } catch (error) {
      console.error("Save job error:", error);
      alert("Unable to update saved job.");
    } finally {
      setSavingJobId(null);
    }
  };

  // =========================
  // APPLY FOR JOB
  // =========================
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
        alert(result.message || "Unable to apply.");
        return;
      }

      alert("Application submitted successfully!");

      setSelectedJob(null);
    } catch (error) {
      console.error("Application error:", error);
      alert("Unable to submit application.");
    } finally {
      setApplyingJobId(null);
    }
  };

  // =========================
  // FILTER + SORT
  // =========================
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((job) => {
        return (
          job.title?.toLowerCase().includes(searchValue) ||
          job.company?.toLowerCase().includes(searchValue) ||
          job.description?.toLowerCase().includes(searchValue) ||
          job.skills?.some((skill) =>
            skill.toLowerCase().includes(searchValue)
          )
        );
      });
    }

    // Location
    if (location) {
      result = result.filter(
        (job) =>
          job.location?.toLowerCase() === location.toLowerCase()
      );
    }

    // Employment Type
    if (employmentType) {
      result = result.filter(
        (job) =>
          job.employmentType?.toLowerCase() ===
          employmentType.toLowerCase()
      );
    }

    // Experience
    if (experience) {
      result = result.filter(
        (job) =>
          job.experience?.toLowerCase() ===
          experience.toLowerCase()
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    if (sortBy === "salary-high") {
      result.sort(
        (a, b) => (b.salary || 0) - (a.salary || 0)
      );
    }

    if (sortBy === "salary-low") {
      result.sort(
        (a, b) => (a.salary || 0) - (b.salary || 0)
      );
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
  // UNIQUE FILTER OPTIONS
  // =========================
  const locations = Array.from(
    new Set(
      jobs
        .map((job) => job.location)
        .filter(Boolean)
    )
  );

  const employmentTypes = Array.from(
    new Set(
      jobs
        .map((job) => job.employmentType)
        .filter(Boolean)
    )
  );

  const experiences = Array.from(
    new Set(
      jobs
        .map((job) => job.experience)
        .filter(Boolean)
    )
  );

  // =========================
  // FORMAT SALARY
  // =========================
  const formatSalary = (salary?: number) => {
    if (!salary) return "Not disclosed";

    return `₹${salary.toLocaleString("en-IN")}`;
  };

  // =========================
  // COMPANY INITIAL
  // =========================
  const getCompanyInitial = (company?: string) => {
    if (!company) return "C";

    return company.charAt(0).toUpperCase();
  };

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setEmploymentType("");
    setExperience("");
    setSortBy("newest");
  };

  return (
    <div className="browse-jobs-page">

      {/* =========================
          HERO
      ========================= */}
      <section className="jobs-hero">

        <div className="hero-content">
          <span className="hero-label">
            OPPORTUNITIES
          </span>

          <h1>
            Find Your Next
            <span> Opportunity</span>
          </h1>

          <p>
            Discover jobs that match your skills,
            experience and career goals.
          </p>
        </div>

        {/* SEARCH */}
        <div className="job-search-container">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search jobs, companies or skills..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="search-location">

            <span>📍</span>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

          </div>

          <button
            className="search-button"
            onClick={() => {}}
          >
            Search Jobs
          </button>

        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="jobs-layout">

        {/* =========================
            SIDEBAR
        ========================= */}
        <aside className="jobs-sidebar">

          <div className="filter-header">
            <h3>Filters</h3>

            <button onClick={clearFilters}>
              Clear all
            </button>
          </div>

          {/* Employment Type */}
          <div className="filter-section">

            <h4>Employment Type</h4>

            <select
              value={employmentType}
              onChange={(e) =>
                setEmploymentType(e.target.value)
              }
            >
              <option value="">
                All Types
              </option>

              {employmentTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

          </div>

          {/* Experience */}
          <div className="filter-section">

            <h4>Experience</h4>

            <select
              value={experience}
              onChange={(e) =>
                setExperience(e.target.value)
              }
            >
              <option value="">
                All Experience
              </option>

              {experiences.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* Location */}
          <div className="filter-section">

            <h4>Location</h4>

            <select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            >
              <option value="">
                All Locations
              </option>

              {locations.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* QUICK TIP */}
          <div className="ai-filter-box">

            <div className="ai-icon">
              ✓
            </div>

            <div>
              <strong>
                Quick Tip
              </strong>

              <p>
                Use filters and search to quickly
                find jobs that match your
                preferences.
              </p>
            </div>

          </div>

        </aside>

        {/* =========================
            JOBS CONTENT
        ========================= */}
        <main className="jobs-content">

          {/* HEADER */}
          <div className="jobs-header">

            <div>
              <h2>
                Available Jobs
              </h2>

              <p>
                {filteredJobs.length} jobs found
              </p>
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="newest">
                Newest
              </option>

              <option value="salary-high">
                Salary: High to Low
              </option>

              <option value="salary-low">
                Salary: Low to High
              </option>
            </select>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="jobs-loading">
              <div className="loading-spinner"></div>
              <p>Loading jobs...</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            filteredJobs.length === 0 && (
              <div className="no-jobs">

                <div className="no-jobs-icon">
                  🔍
                </div>

                <h3>
                  No jobs found
                </h3>

                <p>
                  Try changing your search
                  or filters.
                </p>

                <button
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>
            )}

          {/* JOB CARDS */}
          {!loading &&
            filteredJobs.map((job) => (

              <div
                className="job-card"
                key={job._id}
              >

                {/* COMPANY LOGO */}
                <div className="company-logo">
                  {getCompanyInitial(
                    job.company
                  )}
                </div>

                {/* JOB INFO */}
                <div className="job-main-info">

                  <div className="job-title-row">

                    <h3>
                      {job.title}
                    </h3>

                    {/* NORMAL JOB TYPE */}
                    <div className="match-badge">
                      {job.employmentType ||
                        "Job"}
                    </div>

                  </div>

                  <p className="job-company">
                    {job.company ||
                      "Company"}
                  </p>

                  <div className="job-meta">

                    <span>
                      📍{" "}
                      {job.location ||
                        "Remote"}
                    </span>

                    <span>
                      💼{" "}
                      {job.experience ||
                        "Not specified"}
                    </span>

                    <span>
                      💰{" "}
                      {formatSalary(
                        job.salary
                      )}
                    </span>

                  </div>

                  {/* SKILLS */}
                  <div className="job-skills">

                    {(job.skills || [])
                      .slice(0, 5)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="skill-tag"
                        >
                          {skill}
                        </span>
                      ))}

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="job-actions">

                  <button
                    className={`save-button ${
                      savedJobIds.has(job._id)
                        ? "saved"
                        : ""
                    }`}
                    disabled={
                      savingJobId === job._id
                    }
                    onClick={() =>
                      toggleSaveJob(
                        job._id
                      )
                    }
                  >
                    {savedJobIds.has(job._id)
                      ? "♥"
                      : "♡"}
                  </button>

                  <button
                    className="view-job-button"
                    onClick={() =>
                      setSelectedJob(job)
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))}

        </main>
      </div>

      {/* =========================
          JOB DETAILS MODAL
      ========================= */}
      {selectedJob && (

        <div
          className="job-modal-overlay"
          onClick={() =>
            setSelectedJob(null)
          }
        >

          <div
            className="job-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}
            <button
              className="modal-close"
              onClick={() =>
                setSelectedJob(null)
              }
            >
              ×
            </button>

            {/* HEADER */}
            <div className="modal-header">

              <div className="modal-company-logo">
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
            <div className="modal-meta">

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
            <div className="modal-section">

              <h3>
                Job Description
              </h3>

              <p>
                {selectedJob.description ||
                  "No job description available."}
              </p>

            </div>

            {/* SKILLS */}
            <div className="modal-section">

              <h3>
                Required Skills
              </h3>

              <div className="modal-skills">

                {(selectedJob.skills || [])
                  .map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag"
                    >
                      {skill}
                    </span>
                  ))}

              </div>

            </div>

            {/* ACTIONS */}
            <div className="modal-actions">

              <button
                className={`modal-save-button ${
                  savedJobIds.has(
                    selectedJob._id
                  )
                    ? "saved"
                    : ""
                }`}
                disabled={
                  savingJobId ===
                  selectedJob._id
                }
                onClick={() =>
                  toggleSaveJob(
                    selectedJob._id
                  )
                }
              >
                {savedJobIds.has(
                  selectedJob._id
                )
                  ? "♥ Saved"
                  : "♡ Save Job"}
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
                  ? "Submitting Application..."
                  : "Apply Now"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default BrowseJobs;