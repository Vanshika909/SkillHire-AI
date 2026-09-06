import { useEffect, useState } from "react";
import "./RecruiterProfile.css";

const API = "http://localhost:5000/api";

interface RecruiterProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  location: string;
  bio: string;
  avatar: string;
}

const RecruiterProfile = () => {
  const [profile, setProfile] = useState<RecruiterProfileData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          `${API}/recruiter/profile`,
          {
            headers: authHeaders,
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          const data = result.data || result.user || {};

          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            company: data.company || "",
            website: data.website || "",
            location: data.location || "",
            bio: data.bio || "",
            avatar: data.avatar || "",
          });
        }
      } catch (error) {
        console.error(
          "Failed to load recruiter profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
// UPLOAD PROFILE PHOTO
// ==========================================

const handleAvatarUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    setMessage("");

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(
      `${API}/recruiter/profile/avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      setMessage(
        result.message ||
          "Failed to upload profile picture."
      );
      return;
    }

    const updatedUser =
      result.data || {};

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setProfile((previous) => ({
      ...previous,
      avatar:
        updatedUser.avatar ||
        result.avatarUrl ||
        previous.avatar,
    }));

    setMessage(
      "Profile picture uploaded successfully!"
    );

    event.target.value = "";

    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error) {
    console.error(
      "Avatar upload error:",
      error
    );

    setMessage(
      "Unable to upload profile picture."
    );
  }
};

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `${API}/recruiter/profile`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            name: profile.name.trim(),
            phone: profile.phone.trim(),
            company: profile.company.trim(),
            website: profile.website.trim(),
            location: profile.location.trim(),
            bio: profile.bio.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(
          result.message ||
            "Failed to update profile."
        );
        return;
      }

      const updatedUser =
        result.data || result.user;

      if (updatedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setProfile((previous) => ({
          ...previous,
          name:
            updatedUser.name ?? previous.name,
          email:
            updatedUser.email ?? previous.email,
          phone:
            updatedUser.phone ?? previous.phone,
          company:
            updatedUser.company ?? previous.company,
          website:
            updatedUser.website ?? previous.website,
          location:
            updatedUser.location ?? previous.location,
          bio:
            updatedUser.bio ?? previous.bio,
          avatar:
            updatedUser.avatar ?? previous.avatar,
        }));
      }

      setMessage(
        "Profile updated successfully!"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Update recruiter profile error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="recruiter-profile-page">
        <div className="recruiter-profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="recruiter-profile-page">

      {/* HEADER */}

      <div className="recruiter-profile-header">
        <div>
          <h1>Recruiter Profile</h1>
          <p>
            Manage your personal and company information.
          </p>
        </div>

        <div className="profile-photo-section">

  <div className="recruiter-profile-avatar">
    {profile.avatar ? (
      <img
        src={`http://localhost:5000${profile.avatar}`}
        alt="Profile"
      />
    ) : (
      profile.name
        ?.charAt(0)
        .toUpperCase() || "R"
    )}
  </div>

  <label
    htmlFor="recruiter-avatar-upload"
    className="upload-photo-button"
  >
    📷 Upload Photo
  </label>

  <input
    id="recruiter-avatar-upload"
    type="file"
    accept="image/png,image/jpeg,image/jpg,image/webp"
    onChange={handleAvatarUpload}
    hidden
  />

</div>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="recruiter-profile-message">
          {message}
        </div>
      )}

      {/* FORM */}

      <form
        className="recruiter-profile-card"
        onSubmit={handleSave}
      >

        <div className="profile-section-title">
          <h2>Personal Information</h2>
          <p>
            Keep your contact information up to date.
          </p>
        </div>

        <div className="profile-form-grid">

          <div className="profile-form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="profile-form-group">
            <label>Email</label>

            <input
              type="email"
              value={profile.email}
              disabled
              placeholder="Email"
            />

            <small>
              Email cannot be changed here.
            </small>
          </div>

          <div className="profile-form-group">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="profile-form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="e.g. Noida, Uttar Pradesh"
            />
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-section-title">
          <h2>Company Information</h2>
          <p>
            Add details about the company you represent.
          </p>
        </div>

        <div className="profile-form-grid">

          <div className="profile-form-group">
            <label>Company Name</label>

            <input
              type="text"
              name="company"
              value={profile.company}
              onChange={handleChange}
              placeholder="e.g. SkillHire AI"
            />
          </div>

          <div className="profile-form-group">
            <label>Company Website</label>

            <input
              type="url"
              name="website"
              value={profile.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

        </div>

        <div className="profile-form-group full-width">
          <label>Company / Recruiter Bio</label>

          <textarea
            name="bio"
            rows={6}
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell candidates about yourself and your company..."
          />

          <small>
            This information can help candidates understand
            your company.
          </small>
        </div>

        <div className="profile-form-actions">

          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default RecruiterProfile;