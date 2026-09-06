import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api";

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalRecruiters: number;
  totalAdmins: number;
  totalJobs: number;
  totalApplications: number;
  pendingApplications: number;
  hiredApplications: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

interface Job {
  _id: string;
  title: string;
  company?: string;
  location?: string;
  employmentType?: string;
  recruiter?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
}

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  student?: {
    _id: string;
    name: string;
    email: string;
  };
  job?: {
    _id: string;
    title: string;
    company?: string;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "jobs" | "applications"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
 const [applicationFilter, setApplicationFilter] =
  useState<
    "All" | "Pending" | "Shortlisted" | "Rejected" | "Hired"
  >("All");
  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ==========================================
  // LOAD ADMIN DATA
  // ==========================================

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        const currentToken = localStorage.getItem("token");

        if (!currentToken) {
          throw new Error("Authentication token not found.");
        }

        const headers = {
          Authorization: `Bearer ${currentToken}`,
        };

        const [
          dashboardResponse,
          usersResponse,
          jobsResponse,
          applicationsResponse,
        ] = await Promise.all([
          fetch(`${API}/admin/dashboard`, {
            headers,
          }),

          fetch(`${API}/admin/users`, {
            headers,
          }),

          fetch(`${API}/admin/jobs`, {
            headers,
          }),

          fetch(`${API}/admin/applications`, {
            headers,
          }),
        ]);

        const dashboardData = await dashboardResponse.json();
        const usersData = await usersResponse.json();
        const jobsData = await jobsResponse.json();
        const applicationsData =
          await applicationsResponse.json();

        if (
          !dashboardResponse.ok ||
          !dashboardData.success
        ) {
          throw new Error(
            dashboardData.message ||
              "Failed to load dashboard"
          );
        }

        if (
          !usersResponse.ok ||
          !usersData.success
        ) {
          throw new Error(
            usersData.message ||
              "Failed to load users"
          );
        }

        if (
          !jobsResponse.ok ||
          !jobsData.success
        ) {
          throw new Error(
            jobsData.message ||
              "Failed to load jobs"
          );
        }

        if (
          !applicationsResponse.ok ||
          !applicationsData.success
        ) {
          throw new Error(
            applicationsData.message ||
              "Failed to load applications"
          );
        }

        setStats(dashboardData.data);
        setUsers(usersData.data || []);
        setJobs(jobsData.data || []);
        setApplications(
          applicationsData.data || []
        );
      } catch (error: any) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setMessage(
          error.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const handleChangeRole = async (
    userId: string,
    currentRole: string
  ) => {
    const newRole =
      currentRole === "student"
        ? "recruiter"
        : "student";

    const confirmed = window.confirm(
      `Change this user's role from ${currentRole} to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to change user role."
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

      setMessage(
        `User role changed to ${newRole} successfully.`
      );
    } catch (error: any) {
      console.error(
        "Change role error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to change user role."
      );
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (
    userId: string,
    userName: string,
    userEmail: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName} (${userEmail})?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete user."
        );
      }

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user._id !== userId
        )
      );

      setMessage(
        "User deleted successfully."
      );
    } catch (error: any) {
      console.error(
        "Delete user error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to delete user."
      );
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDeleteJob = async (
    jobId: string,
    jobTitle: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobTitle}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/admin/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete job."
        );
      }

      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => job._id !== jobId
        )
      );

      setStats((prevStats) =>
        prevStats
          ? {
              ...prevStats,
              totalJobs:
                Math.max(
                  0,
                  prevStats.totalJobs - 1
                ),
            }
          : prevStats
      );

      setMessage(
        "Job deleted successfully."
      );
    } catch (error: any) {
      console.error(
        "Delete job error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to delete job."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  const filteredApplications =
  applicationFilter === "All"
    ? applications
    : applications.filter(
        (application) =>
          application.status === applicationFilter
      );

  return (
    <div className="admin-page">

      {/* ==========================================
          HEADER
          ========================================== */}

      <div className="admin-header">
        <div>
          <p className="admin-label">
            ADMIN PANEL
          </p>

          <h1>Admin Dashboard</h1>

          <p className="admin-subtitle">
            Monitor and manage the SkillHire AI
            platform.
          </p>
        </div>

        <div className="admin-header-icon">
          🛡️
        </div>
      </div>

      {/* ==========================================
          MESSAGE
          ========================================== */}

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {/* ==========================================
          TABS
          ========================================== */}

      <div className="admin-tabs">
        <button
          className={
            activeTab === "overview"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("overview")
          }
        >
          Overview
        </button>

        <button
          className={
            activeTab === "users"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("users")
          }
        >
          Users
        </button>

        <button
          className={
            activeTab === "jobs"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("jobs")
          }
        >
          Jobs
        </button>

        <button
          className={
            activeTab === "applications"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("applications")
          }
        >
          Applications
        </button>
      </div>

      {/* ==========================================
          OVERVIEW
          ========================================== */}

      {activeTab === "overview" &&
        stats && (
          <>
            <div className="admin-stats">

              <div className="admin-stat-card">
                <div className="admin-stat-icon purple">
                  👥
                </div>

                <div>
                  <span>Total Users</span>
                  <strong>
                    {stats.totalUsers}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon blue">
                  🎓
                </div>

                <div>
                  <span>Students</span>
                  <strong>
                    {stats.totalStudents}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon green">
                  💼
                </div>

                <div>
                  <span>Recruiters</span>
                  <strong>
                    {stats.totalRecruiters}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon orange">
                  📋
                </div>

                <div>
                  <span>Total Jobs</span>
                  <strong>
                    {stats.totalJobs}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon dark">
                  📝
                </div>

                <div>
                  <span>Applications</span>
                  <strong>
                    {stats.totalApplications}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon yellow">
                  ⏳
                </div>

                <div>
                  <span>Pending</span>
                  <strong>
                    {stats.pendingApplications}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon teal">
                  ✓
                </div>

                <div>
                  <span>Hired</span>
                  <strong>
                    {stats.hiredApplications}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon red">
                  🛡️
                </div>

                <div>
                  <span>Admins</span>
                  <strong>
                    {stats.totalAdmins}
                  </strong>
                </div>
              </div>

            </div>

            {/* SUMMARY */}

            <div className="admin-content-grid">

              <section className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h2>Recent Users</h2>

                    <p>
                      Latest registered users
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setActiveTab("users")
                    }
                  >
                    View All
                  </button>
                </div>

                <div className="admin-mini-list">
                  {users
                    .slice(0, 5)
                    .map((user) => (
                      <div
                        className="admin-mini-row"
                        key={user._id}
                      >
                        <div className="admin-user-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}
                        </div>

                        <div>
                          <strong>
                            {user.name}
                          </strong>

                          <small>
                            {user.email}
                          </small>
                        </div>

                        <span
                          className={`role-pill ${user.role}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    ))}
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h2>Recent Jobs</h2>

                    <p>
                      Latest job postings
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setActiveTab("jobs")
                    }
                  >
                    View All
                  </button>
                </div>

                <div className="admin-mini-list">
                  {jobs
                    .slice(0, 5)
                    .map((job) => (
                      <div
                        className="admin-mini-row"
                        key={job._id}
                      >
                        <div className="job-mini-icon">
                          💼
                        </div>

                        <div>
                          <strong>
                            {job.title}
                          </strong>

                          <small>
                            {job.company ||
                              "Company"}
                          </small>
                        </div>

                        <span>
                          {job.location ||
                            "Remote"}
                        </span>
                      </div>
                    ))}
                </div>
              </section>

            </div>
          </>
        )}

      {/* ==========================================
          USERS
          ========================================== */}

      {activeTab === "users" && (
        <section className="admin-card">

          <div className="admin-card-header">
            <div>
              <h2>All Users</h2>

              <p>
                Students, recruiters and admins
              </p>
            </div>

            <span className="admin-count">
              {users.length} users
            </span>
          </div>

          {users.length === 0 ? (
            <div className="admin-empty">
              No users found.
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>

                      <td>
                        <div className="admin-table-user">

                          <div className="admin-user-avatar">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "U"}
                          </div>

                          <strong>
                            {user.name}
                          </strong>

                        </div>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <span
                          className={`role-pill ${user.role}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {user.phone || "—"}
                      </td>

                      <td>
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      <td>
                        <div className="admin-user-actions">

                          {user.role !== "admin" && (
                            <button
                              className="admin-action-button role-button"
                              onClick={() =>
                                handleChangeRole(
                                  user._id,
                                  user.role
                                )
                              }
                            >
                              Change Role
                            </button>
                          )}

                          {user.role !== "admin" && (
                            <button
                              className="admin-action-button delete-button"
                              onClick={() =>
                                handleDeleteUser(
                                  user._id,
                                  user.name,
                                  user.email
                                )
                              }
                            >
                              Delete
                            </button>
                          )}

                          {user.role === "admin" && (
                            <span className="admin-protected-text">
                              Protected
                            </span>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

      {/* ==========================================
          JOBS
          ========================================== */}

      {activeTab === "jobs" && (
        <section className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>All Jobs</h2>

              <p>
                Monitor jobs posted on the platform
              </p>
            </div>

            <span className="admin-count">
              {jobs.length} jobs
            </span>

          </div>

          {jobs.length === 0 ? (
            <div className="admin-empty">
              No jobs found.
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Recruiter</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {jobs.map((job) => (
                    <tr key={job._id}>

                      <td>
                        <strong>
                          {job.title}
                        </strong>
                      </td>

                      <td>
                        {job.company || "—"}
                      </td>

                      <td>
                        {job.recruiter?.name ||
                          "—"}
                      </td>

                      <td>
                        {job.location ||
                          "Remote"}
                      </td>

                      <td>
                        {job.employmentType ||
                          "—"}
                      </td>

                      <td>
                        {formatDate(
                          job.createdAt
                        )}
                      </td>

                      <td>
                        <button
                          className="admin-action-button delete-button"
                          onClick={() =>
                            handleDeleteJob(
                              job._id,
                              job.title
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

      {/* ==========================================
          APPLICATIONS
          ========================================== */}

      {activeTab === "applications" && (
        <section className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>All Applications</h2>

              <p>
                Monitor application activity
              </p>
            </div>

            <span className="admin-count">
              {filteredApplications.length} applications
            </span>

          </div>
          <div className="admin-application-filters">
  {[
    "All",
    "Pending",
    "Shortlisted",
    "Rejected",
    "Hired",
  ].map((filter) => (
    <button
      key={filter}
      className={
        applicationFilter === filter
          ? "admin-filter-button active"
          : "admin-filter-button"
      }
      onClick={() =>
        setApplicationFilter(
          filter as
            | "All"
            | "Pending"
            | "Shortlisted"
            | "Rejected"
            | "Hired"
        )
      }
    >
      {filter}
    </button>
  ))}
</div>
          {filteredApplications.length === 0 ? (
            <div className="admin-empty">
              No applications found.
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredApplications.map(
                    (application) => (
                      <tr
                        key={application._id}
                      >

                        <td>
                          <strong>
                            {application.student
                              ?.name ||
                              "Student"}
                          </strong>
                        </td>

                        <td>
                          {application.student
                            ?.email ||
                            "—"}
                        </td>

                        <td>
                          {application.job
                            ?.title ||
                            "—"}
                        </td>

                        <td>
                          {application.job
                            ?.company ||
                            "—"}
                        </td>

                        <td>
                          <span
                            className={`status-pill ${application.status.toLowerCase()}`}
                          >
                            {application.status}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            application.createdAt
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

    </div>
  );
};

export default AdminDashboard;