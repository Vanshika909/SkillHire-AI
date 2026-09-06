import { useEffect, useState } from "react";

import BrowseJobs from "./pages/BrowseJobs";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./pages/RecruiterDashboard";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecruiterProfile from "./pages/RecruiterProfile";
import AdminDashboard from "./pages/AdminDashboard";


const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

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
  createdAt?: string;
}

interface Application {
  _id: string;
  job: Job | string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  /* =========================
     AUTH STATE
  ========================= */

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(() => {
      return !!localStorage.getItem("token");
    });

  const [authPage, setAuthPage] = useState<
    "login" | "signup"
  >("login");

  /* =========================
     USER ROLE
  ========================= */

  const [userRole, setUserRole] = useState<string>(() => {
    const user = localStorage.getItem("user");

    if (!user) return "";

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role || "";
    } catch {
      return "";
    }
  });

  /* =========================
     PAGE
  ========================= */

  const [page, setPage] = useState("dashboard");

  /* =========================
     DATA
  ========================= */

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] =
    useState<Application[]>([]);
  const [studentSkills, setStudentSkills] =
    useState<string[]>([]);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    // Wait until the user's role is known.
    if (!userRole) return;

    /* ---------- JOBS ---------- */

    fetch(`${API}/jobs`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setJobs(result.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });

    /* ---------- STUDENT APPLICATIONS ---------- */

    if (userRole === "student") {
      fetch(`${API}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setApplications(result.data || []);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching applications:",
            error
          );
        });
    }

    /* ---------- STUDENT PROFILE ---------- */

    if (userRole === "student") {
      fetch(
        `${API}/student/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setStudentSkills(
              result.data?.skills || []
            );
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching profile:",
            error
          );
        });
    }
  }, [isAuthenticated, userRole]);

  /* =========================
     APPLICATION STATS
  ========================= */

  const totalApplications = applications.length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() === "pending"
    ).length;

  const shortlistedApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() ===
        "shortlisted"
    ).length;

  const hiredApplications =
    applications.filter(
      (application) =>
        application.status?.toLowerCase() === "hired"
    ).length;

  /* =========================
     AI MATCH HELPER

     NOTE:
     This only keeps your existing
     dashboard matching display.
     No new AI functionality added.
  ========================= */

  const getJobMatch = (job: Job) => {
    if (
      !studentSkills.length ||
      !job.skills ||
      !job.skills.length
    ) {
      return 0;
    }

    const matchedSkills = job.skills.filter(
      (skill) =>
        studentSkills.some(
          (studentSkill) =>
            studentSkill.toLowerCase() ===
            skill.toLowerCase()
        )
    );

    return Math.round(
      (matchedSkills.length / job.skills.length) * 100
    );
  };

  const rankedJobs = [...jobs]
    .map((job) => ({
      ...job,
      matchScore: getJobMatch(job),
    }))
    .sort(
      (a, b) =>
        (b.matchScore || 0) -
        (a.matchScore || 0)
    );

  /* =========================
     AUTHENTICATION
  ========================= */

  if (!isAuthenticated) {
    if (authPage === "signup") {
      return (
        <Signup
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onSignup={() => setAuthPage("signup")}
        onLoginSuccess={() => {
          const user =
            localStorage.getItem("user");

          if (user) {
            try {
              const parsedUser =
                JSON.parse(user);

              setUserRole(
                parsedUser.role || ""
              );
            } catch {
              setUserRole("");
            }
          }

          setIsAuthenticated(true);
          setPage("dashboard");
        }}
      />
    );
  }

  /* =========================
     LOGGED-IN APPLICATION
  ========================= */

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="brand-logo">
            S
          </div>

          <span>
            SkillHire AI
          </span>
        </div>

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

           {userRole !== "admin" && (
            <button
              className={
                page === "dashboard"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setPage("dashboard")}
            >
              <span>⌂</span>
              Dashboard
            </button>
          )}

          {/* =========================
              STUDENT NAVIGATION
          ========================= */}

          {userRole === "student" && (
            <>
              <button
                className={
                  page === "jobs"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("jobs")
                }
              >
                <span>💼</span>
                Browse Jobs
              </button>

              <button
                className={
                  page === "applications"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("applications")
                }
              >
                <span>📄</span>
                Applications
              </button>

              <button
                className={
                  page === "saved"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("saved")
                }
              >
                <span>🔖</span>
                Saved Jobs
              </button>

              <button
                className={
                  page === "notifications"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("notifications")
                }
              >
                <span>🔔</span>
                Notifications
              </button>

              <button
                className={
                  page === "profile"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("profile")
                }
              >
                <span>👤</span>
                Profile
              </button>
            </>
          )}

          {/* =========================
              RECRUITER NAVIGATION
          ========================= */}

          {userRole === "recruiter" && (
            <>
              <button
                className={
                  page === "jobs"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("jobs")
                }
              >
                <span>💼</span>
                My Jobs
              </button>

              <button
                className={
                  page === "profile"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage("profile")
                }
              >
                <span>👤</span>
                Profile
              </button>
            </>
          )}
          {/* =========================
    ADMIN NAVIGATION
========================= */}

{userRole === "admin" && (
  <>
    <button
      className={
        page === "dashboard"
          ? "nav-item active"
          : "nav-item"
      }
      onClick={() => setPage("dashboard")}
    >
      <span>🛡️</span>
      Admin Dashboard
    </button>
  </>
)}
        </nav>

        {/* ---------- LOGOUT ---------- */}

        <div className="sidebar-bottom">

          <button
            className="nav-item logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              setIsAuthenticated(false);
              setUserRole("");
              setAuthPage("login");
              setPage("dashboard");
              setApplications([]);
              setStudentSkills([]);
            }}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

        {/* =========================
            RECRUITER DASHBOARD
        ========================= */}

        {page === "dashboard" &&
        
          userRole === "recruiter" && (
            <RecruiterDashboard />
          )}

        {page === "dashboard" &&
          userRole === "admin" && (
            <AdminDashboard />
          )}

        {/* =========================
            STUDENT DASHBOARD
        ========================= */}

        {page === "dashboard" &&
          userRole === "student" && (
            <div className="dashboard">

              {/* ---------- HEADER ---------- */}

              <div className="dashboard-header">

                <div>
                  <p className="dashboard-label">
                    STUDENT DASHBOARD
                  </p>

                  <h1>
                    Welcome back, Vanshika! 👋
                  </h1>

                  <p>
                    Here's what's happening with
                    your job search.
                  </p>
                </div>

              </div>

              {/* ---------- STATS ---------- */}

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    📄
                  </div>

                  <div>
                    <span>
                      Applications
                    </span>

                    <strong>
                      {totalApplications}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    ⏳
                  </div>

                  <div>
                    <span>
                      Pending
                    </span>

                    <strong>
                      {pendingApplications}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    ✓
                  </div>

                  <div>
                    <span>
                      Shortlisted
                    </span>

                    <strong>
                      {shortlistedApplications}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    🎉
                  </div>

                  <div>
                    <span>
                      Hired
                    </span>

                    <strong>
                      {hiredApplications}
                    </strong>
                  </div>

                </div>

              </div>

              {/* ---------- RECENT APPLICATIONS ---------- */}

              <section className="dashboard-section">

                <div className="section-header">

                  <div>
                    <h2>
                      Recent Applications
                    </h2>

                    <p>
                      Track the status of your
                      latest applications.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setPage("applications")
                    }
                  >
                    View All →
                  </button>

                </div>

                <div className="applications-preview">

                  {applications.length === 0 ? (
                    <div className="empty-state">

                      <h3>
                        No applications yet
                      </h3>

                      <p>
                        Start applying to jobs
                        that match your skills.
                      </p>

                      <button
                        onClick={() =>
                          setPage("jobs")
                        }
                      >
                        Browse Jobs
                      </button>

                    </div>
                  ) : (
                    applications
                      .slice(0, 3)
                      .map(
                        (application) => {

                          const job =
                            typeof application.job ===
                            "object"
                              ? application.job
                              : null;

                          return (
                            <div
                              className="application-row"
                              key={
                                application._id
                              }
                            >

                              <div className="application-company">

                                <div className="company-avatar">
                                  {job?.company
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    "S"}
                                </div>

                                <div>
                                  <strong>
                                    {job?.title ||
                                      "Job"}
                                  </strong>

                                  <span>
                                    {job?.company ||
                                      "Company"}
                                  </span>
                                </div>

                              </div>

                              <div>
                                <span>
                                  {job?.location ||
                                    "Remote"}
                                </span>
                              </div>

                              <div
                                className={`application-status ${
                                  application.status
                                    ?.toLowerCase()
                                }`}
                              >
                                {
                                  application.status
                                }
                              </div>

                            </div>
                          );
                        }
                      )
                  )}

                </div>

              </section>

              {/* ---------- RECOMMENDED JOBS ---------- */}

              <section className="dashboard-section">

                <div className="section-header">

                  <div>
                    <h2>
                      Recommended Jobs
                    </h2>

                    <p>
                      Opportunities you may be
                      interested in.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setPage("jobs")
                    }
                  >
                    Browse All →
                  </button>

                </div>

                <div className="job-preview-grid">

                  {rankedJobs
                    .slice(0, 3)
                    .map((job) => (

                      <div
                        className="dashboard-job-card"
                        key={job._id}
                      >

                        <div className="job-card-top">

                          <div className="company-avatar">
                            {job.company
                              ?.charAt(0)
                              .toUpperCase() ||
                              "S"}
                          </div>

                          <span className="match-badge">
                            {job.matchScore || 0}%
                            Match
                          </span>

                        </div>

                        <h3>
                          {job.title}
                        </h3>

                        <p>
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
                            {job.employmentType ||
                              "Full-Time"}
                          </span>

                        </div>

                      </div>

                    ))}

                </div>

              </section>

            </div>
          )}

        {/* =========================
            STUDENT PAGES
        ========================= */}

        {page === "jobs" &&
          userRole === "student" && (
            <BrowseJobs />
          )}

        {page === "applications" &&
          userRole === "student" && (
            <Applications />
          )}

        {page === "saved" &&
          userRole === "student" && (
            <SavedJobs />
          )}

        {page === "notifications" &&
          userRole === "student" && (
            <Notifications  />
          )}

        {page === "profile" &&
  userRole === "student" && (
    <Profile />
  )}

{page === "profile" &&
  userRole === "recruiter" && (
    <RecruiterProfile />
  )}
        

        {/* =========================
            RECRUITER JOBS
        ========================= */}

        {page === "jobs" &&
          userRole === "recruiter" && (
            <RecruiterDashboard />
          )}

      </main>

    </div>
  );
}

export default App;