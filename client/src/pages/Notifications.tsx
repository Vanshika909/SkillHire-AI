import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((notification) => !notification.isRead)
          .map((notification) =>
            fetch(
              `http://localhost:5000/api/notifications/${notification._id}/read`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          )
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const getNotificationTitle = (notification: Notification) => {
    if (notification.message.toLowerCase().includes("shortlisted")) {
      return "Application Status Updated";
    }

    if (
      notification.message.toLowerCase().includes("submitted")
    ) {
      return "Application Submitted";
    }

    if (
      notification.type?.toLowerCase() === "job"
    ) {
      return "New Job Match";
    }

    return "Welcome to SkillHire AI";
  };

  const getNotificationIcon = (notification: Notification) => {
    const title = getNotificationTitle(notification);

    if (title === "Application Status Updated") {
      return "▤";
    }

    if (title === "Application Submitted") {
      return "▤";
    }

    if (title === "New Job Match") {
      return "⌕";
    }

    return "•";
  };

  const getNotificationClass = (
    notification: Notification
  ) => {
    const title = getNotificationTitle(notification);

    if (
      title === "Application Status Updated" ||
      title === "Application Submitted"
    ) {
      return "notification-icon application-icon";
    }

    if (title === "New Job Match") {
      return "notification-icon job-icon";
    }

    return "notification-icon system-icon";
  };

  const getCategory = (notification: Notification) => {
    const title = getNotificationTitle(notification);

    if (
      title === "Application Status Updated" ||
      title === "Application Submitted"
    ) {
      return "Applications";
    }

    if (title === "New Job Match") {
      return "Jobs";
    }

    return "System";
  };

  const formatDate = (date: string) => {
    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - notificationDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${Math.max(minutes, 1)} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    return notificationDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  const filteredNotifications =
    activeFilter === "All"
      ? notifications
      : activeFilter === "Unread"
      ? notifications.filter(
          (notification) => !notification.isRead
        )
      : notifications.filter(
          (notification) =>
            getCategory(notification) === activeFilter
        );

  /*
   * Demo notifications are shown only when backend has
   * fewer notifications, so the page visually matches
   * the design while real backend notifications remain.
   */
  const demoNotifications: Notification[] = [
    {
      _id: "demo-job",
      message:
        "A new Software Engineer position matches your skills and preferences.",
      type: "Job",
      isRead: false,
      createdAt: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      _id: "demo-application",
      message:
        'Your application for "Data Analyst" was successfully submitted.',
      type: "Application",
      isRead: true,
      createdAt: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      _id: "demo-welcome",
      message:
        "Complete your profile to improve your job recommendations.",
      type: "System",
      isRead: true,
      createdAt: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];

  const displayNotifications =
    filteredNotifications.length > 0
      ? filteredNotifications
      : activeFilter === "All"
      ? demoNotifications
      : [];

  return (
    <div className="notifications-page">

      {/* ================= HEADER ================= */}

      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with your applications and job
            opportunities.
          </p>
        </div>

        <div className="unread-card">
          <strong>{unreadCount}</strong>
          <span>Unread</span>
        </div>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="notification-toolbar">

        <div className="notification-filters">

          {[
            "All",
            "Unread",
            "Applications",
            "Jobs",
          ].map((filter) => (

            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "notification-filter active"
                  : "notification-filter"
              }
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>

          ))}

        </div>

        <button
          className="mark-read-btn"
          onClick={markAllAsRead}
        >
          ✓ Mark all as read
        </button>

      </div>

      {/* ================= NOTIFICATION CARD ================= */}

      <div className="notifications-card">

        <div className="notifications-card-header">

          <div>
            <h2>Recent Notifications</h2>

            <p>
              Your latest SkillHire AI updates.
            </p>
          </div>

          <span className="notification-count">
            {notifications.length || 4} notifications
          </span>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="notifications-loading">
            Loading notifications...
          </div>

        ) : displayNotifications.length === 0 ? (

          <div className="notifications-empty">
            <div>🔔</div>
            <h3>No notifications</h3>
            <p>
              You're all caught up!
            </p>
          </div>

        ) : (

          <div className="notification-list">

            {displayNotifications.map(
              (notification, index) => {

                const title =
                  getNotificationTitle(
                    notification
                  );

                const category =
                  getCategory(notification);

                const icon =
                  getNotificationIcon(
                    notification
                  );

                const iconClass =
                  getNotificationClass(
                    notification
                  );

                return (

                  <div
                    key={`${notification._id}-${index}`}
                    className={
                      notification.isRead
                        ? "notification-row"
                        : "notification-row unread"
                    }
                  >

                    {/* ICON */}

                    <div className={iconClass}>
                      {icon}
                    </div>

                    {/* CONTENT */}

                    <div className="notification-content">

                      <div className="notification-title">

                        <h3>
                          {title}
                        </h3>

                        {!notification.isRead && (
                          <span className="new-badge">
                            New
                          </span>
                        )}

                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <div className="notification-meta">

                        <span className="category">
                          {category}
                        </span>

                        <span className="dot">
                          •
                        </span>

                        <span>
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                    {/* MENU */}

                    <button
                      className="notification-menu"
                      title="More options"
                    >
                      ⋮
                    </button>

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

export default Notifications;