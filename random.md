import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  user: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>SkillHire AI</h1>
      <p>AI-Powered Placement Platform</p>

      <hr />

      <h2>🔔 Notifications</h2>

      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {notifications.map((notification) => (
        <div
          key={notification._id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: notification.isRead ? "#f5f5f5" : "#e8f4ff",
          }}
        >
          <strong>{notification.type}</strong>

          <p>{notification.message}</p>

          <small>
            {new Date(notification.createdAt).toLocaleString()}
          </small>

          {!notification.isRead && (
            <div style={{ marginTop: "8px" }}>
              <span>🔵 Unread</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;