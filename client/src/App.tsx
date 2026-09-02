import { useState } from "react";
import BrowseJobs from "./pages/BrowseJobs";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary?: number;
  skills?: string[];
}

interface Application {
  _id: string;
  student: string;
  job: Job | string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [page, setPage] = useState("dashboard");

  const [jobs] = useState<Job[]>([]);
  const [applications] = useState<Application[]>([]);
  const [loading] = useState(false);
  const [error] = useState("");

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) =>
      application.status.toLowerCase() === "pending"
  ).length;

  const shortlistedApplications = applications.filter(
    (application) =>
      application.status.toLowerCase() === "shortlisted"
  ).length;

  const hiredApplications = applications.filter(
    (application) =>
      application.status.toLowerCase() === "hired"
  ).length;

  const getApplicationJob = (
    application: Application
  ): Job | null => {
    if (
      typeof application.job === "object" &&
      application.job !== null
    ) {
      return application.job;
    }

    const jobId = application.job;

    return (
      jobs.find((job) => job._id === jobId) || null
    );
  };

  const navigate = (newPage: string) => {
    setPage(newPage);
  };

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside
        className="sidebar"
        style={{
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >

        <div className="logo">
          SkillHire <span>AI</span>
        </div>

        <p className="nav-title">MENU</p>

        {/* Dashboard */}
        <div
          className={`nav-item ${
            page === "dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("dashboard")}
          role="button"
          tabIndex={0}
        >
          ▣ Dashboard
        </div>

        {/* Browse Jobs */}
        <div
          className={`nav-item ${
            page === "jobs" ? "active" : ""
          }`}
          onClick={() => navigate("jobs")}
          role="button"
          tabIndex={0}
        >
          ⌕ Browse Jobs
        </div>

        {/* Applications */}
        <div
          className={`nav-item ${
            page === "applications" ? "active" : ""
          }`}
          onClick={() => navigate("applications")}
          role="button"
          tabIndex={0}
        >
          ▤ Applications
        </div>

        {/* Saved Jobs */}
        <div
          className={`nav-item ${
            page === "saved" ? "active" : ""
          }`}
          onClick={() => navigate("saved")}
          role="button"
          tabIndex={0}
        >
          ♡ Saved Jobs
        </div>

        {/* Notifications */}
        <div
          className={`nav-item ${
            page === "notifications" ? "active" : ""
          }`}
          onClick={() => navigate("notifications")}
          role="button"
          tabIndex={0}
        >
          🔔 Notifications
        </div>

        {/* Profile */}
        <div
          className={`nav-item ${
            page === "profile" ? "active" : ""
          }`}
          onClick={() => navigate("profile")}
          role="button"
          tabIndex={0}
        >
          ◉ Profile
        </div>

        {/* Logout */}
        <div
          className="nav-item logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          role="button"
          tabIndex={0}
        >
          ↪ Logout
        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="main">

        {/* ================= BROWSE JOBS ================= */}

        {page === "jobs" ? (

          <BrowseJobs />

        ) : page === "applications" ? (

          /* ================= APPLICATIONS ================= */

          <Applications />

        ) : page === "saved" ? (

          /* ================= SAVED JOBS ================= */

          <SavedJobs />

        ) : page === "notifications" ? (

          /* ================= NOTIFICATIONS ================= */

          <Notifications />

        ) : page === "profile" ? <Profile /> : (

          /* ================= DASHBOARD ================= */

          <>

            {/* ================= HEADER ================= */}

            <header className="header">

              <div>

                <h1>
                  Welcome back, Vanshika! 👋
                </h1>

                <p>
                  Here's what's happening with your
                  job search today.
                </p>

              </div>

              <div className="header-right">

                <div
                  className="notification"
                  onClick={() => navigate("notifications")}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  🔔
                </div>

                <div className="avatar">
                  V
                </div>

              </div>

            </header>

            {/* ================= ERROR ================= */}

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            {/* ================= LOADING ================= */}

            {loading ? (

              <div className="card">

                <h2>
                  Loading dashboard...
                </h2>

                <p>
                  Please wait.
                </p>

              </div>

            ) : (

              <>

                {/* ================= STATS ================= */}

                <section className="stats">

                  {/* Applied */}

                  <div className="card">

                    <div className="stat-label">
                      Applied
                    </div>

                    <div className="stat-value">
                      {totalApplications}
                    </div>

                    <div className="stat-change">
                      Your total applications
                    </div>

                  </div>

                  {/* Pending */}

                  <div className="card">

                    <div className="stat-label">
                      Pending
                    </div>

                    <div className="stat-value">
                      {pendingApplications}
                    </div>

                    <div className="stat-change">
                      Applications under review
                    </div>

                  </div>

                  {/* Shortlisted */}

                  <div className="card">

                    <div className="stat-label">
                      Shortlisted
                    </div>

                    <div className="stat-value">
                      {shortlistedApplications}
                    </div>

                    <div className="stat-change">
                      Great progress!
                    </div>

                  </div>

                  {/* Hired */}

                  <div className="card">

                    <div className="stat-label">
                      Hired
                    </div>

                    <div className="stat-value">
                      {hiredApplications}
                    </div>

                    <div className="stat-change">
                      Congratulations 🎉
                    </div>

                  </div>

                </section>

                {/* ================= CONTENT ================= */}

                <section className="content-grid">

                  {/* ================= RECOMMENDED JOBS ================= */}

                  <div className="card">

                    <div className="section-header">

                      <h2>
                        Recommended Jobs
                      </h2>

                      <span
                        className="view-all"
                        onClick={() => navigate("jobs")}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        View All →
                      </span>

                    </div>

                    {jobs.length === 0 ? (

                      <p>
                        No jobs available right now.
                      </p>

                    ) : (

                      jobs
                        .slice(0, 3)
                        .map((job) => (

                          <div
                            className="job"
                            key={job._id}
                          >

                            <div className="job-top">

                              <div className="job-info">

                                <div className="company-logo">

                                  {job.company
                                    ? job.company
                                        .charAt(0)
                                        .toUpperCase()
                                    : "J"}

                                </div>

                                <div>

                                  <h3>
                                    {job.title}
                                  </h3>

                                  <div className="company">
                                    {job.company}
                                  </div>

                                </div>

                              </div>

                              <div className="match">
                                AI Match
                              </div>

                            </div>

                            <div className="job-details">

                              <span>
                                📍 {job.location}
                              </span>

                              <span>
                                💼 {job.employmentType}
                              </span>

                              <span>
                                ₹
                                {job.salary?.toLocaleString()}
                              </span>

                            </div>

                            <div
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                              }}
                            >

                              {job.skills
                                ?.slice(0, 4)
                                .map((skill) => (

                                  <span
                                    key={skill}
                                    style={{
                                      background:
                                        "#eef2ff",
                                      color:
                                        "#4f46e5",
                                      padding:
                                        "4px 8px",
                                      borderRadius:
                                        "5px",
                                      fontSize:
                                        "11px",
                                    }}
                                  >
                                    {skill}
                                  </span>

                                ))}

                            </div>

                            <button
                              className="apply-btn"
                              onClick={() =>
                                navigate("jobs")
                              }
                            >
                              View Job
                            </button>

                          </div>

                        ))

                    )}

                  </div>

                  {/* ================= RECENT APPLICATIONS ================= */}

                  <div className="card">

                    <div className="section-header">

                      <h2>
                        Recent Applications
                      </h2>

                      <span
                        className="view-all"
                        onClick={() =>
                          navigate("applications")
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        View All →
                      </span>

                    </div>

                    {applications.length === 0 ? (

                      <p>
                        You haven't applied to any
                        jobs yet.
                      </p>

                    ) : (

                      applications
                        .slice(0, 5)
                        .map((application) => {

                          const job =
                            getApplicationJob(
                              application
                            );

                          return (

                            <div
                              className="application"
                              key={application._id}
                            >

                              <div className="application-top">

                                <div>

                                  <h3>
                                    {job
                                      ? job.title
                                      : "Job Application"}
                                  </h3>

                                  <p>
                                    {job
                                      ? job.company
                                      : "SkillHire AI"}
                                  </p>

                                </div>

                                <span
                                  className={`badge ${
                                    application.status.toLowerCase()
                                  }`}
                                >
                                  {application.status}
                                </span>

                              </div>

                              <small>
                                Applied{" "}
                                {new Date(
                                  application.createdAt
                                ).toLocaleDateString()}
                              </small>

                            </div>

                          );

                        })

                    )}

                  </div>

                </section>

                {/* ================= AI RECOMMENDATIONS ================= */}

                <section
                  style={{
                    marginTop: "25px",
                  }}
                >

                  <div className="section-header">

                    <h2>
                      ✨ AI-Powered Recommendations
                    </h2>

                    <span
                      style={{
                        color: "#7b8496",
                        fontSize: "13px",
                      }}
                    >
                      Based on your profile
                    </span>

                  </div>

                  {jobs
                    .slice(0, 3)
                    .map((job, index) => {

                      const matchScores = [
                        95,
                        88,
                        82,
                      ];

                      return (

                        <div
                          className="card"
                          key={`recommendation-${job._id}`}
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "18px",
                            }}
                          >

                            <div
                              style={{
                                width: "55px",
                                height: "55px",
                                borderRadius:
                                  "50%",
                                background:
                                  "#eef2ff",
                                color:
                                  "#6366f1",
                                display: "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight:
                                  "700",
                              }}
                            >
                              {matchScores[index]}%
                            </div>

                            <div>

                              <h3
                                style={{
                                  margin: 0,
                                  fontSize:
                                    "15px",
                                }}
                              >
                                {job.title}
                              </h3>

                              <p
                                style={{
                                  margin:
                                    "5px 0",
                                  color:
                                    "#7b8496",
                                  fontSize:
                                    "12px",
                                }}
                              >
                                {job.company}
                              </p>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "6px",
                                  flexWrap:
                                    "wrap",
                                }}
                              >

                                {job.skills
                                  ?.slice(0, 4)
                                  .map(
                                    (skill) => (

                                      <span
                                        key={
                                          skill
                                        }
                                        style={{
                                          fontSize:
                                            "10px",
                                          background:
                                            "#f0f2ff",
                                          color:
                                            "#6366f1",
                                          padding:
                                            "4px 7px",
                                          borderRadius:
                                            "4px",
                                        }}
                                      >
                                        {skill}
                                      </span>

                                    )
                                  )}

                              </div>

                            </div>

                          </div>

                          <button
                            style={{
                              border:
                                "1px solid #6366f1",
                              background:
                                "white",
                              color:
                                "#6366f1",
                              padding:
                                "10px 18px",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "600",
                            }}
                            onClick={() =>
                              navigate("jobs")
                            }
                          >
                            View Details →
                          </button>

                        </div>

                      );

                    })}

                </section>

              </>

            )}

          </>

        )}

      </main>

    </div>
  );
}

export default App;