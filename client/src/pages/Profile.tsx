import { useEffect, useState } from "react";
import "./Profile.css";

const API = import.meta.env.PROD
  ? "https://skillhire-ai-backend.onrender.com/api"
  : "http://localhost:5000/api";

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  college?: string;
  skills?: string[];
  resume?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    college: "",
    bio: "",
    skills: "",
    resume: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/student/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load profile"
          );
        }

        const user = result.data;

        setProfile(user);

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          college: user.college || "",
          bio: user.bio || "",
          skills: user.skills?.join(", ") || "",
          resume: user.resume || "",
        });
      } catch (err: any) {
        setError(
          err.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("Please login first.");
      setLoading(false);
    }
  }, [token]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PROFILE PICTURE UPLOAD
  // =========================

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile picture must be smaller than 5 MB."
      );

      e.target.value = "";
      return;
    }

    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const uploadData = new FormData();

      uploadData.append("avatar", file);

      const response = await fetch(
        `${API}/student/profile/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Profile picture upload failed"
        );
      }

      // Update profile immediately
      setProfile(result.data);

      setMessage(
        "Profile picture updated successfully!"
      );
    } catch (err: any) {
      console.error(
        "Profile picture upload error:",
        err
      );

      setError(
        err.message ||
          "Failed to upload profile picture"
      );
    } finally {
      setSaving(false);

      // Allows selecting the same image again
      e.target.value = "";
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await fetch(
        `${API}/student/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            college: formData.college,
            bio: formData.bio,
            skills: skillsArray,
            resume: formData.resume,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update profile"
        );
      }

      setProfile(result.data);

      setFormData({
        name: result.data.name || "",
        phone: result.data.phone || "",
        college: result.data.college || "",
        bio: result.data.bio || "",
        skills:
          result.data.skills?.join(", ") || "",
        resume: result.data.resume || "",
      });

      setMessage(
        "Profile updated successfully!"
      );
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // =========================
  // INITIALS
  // =========================

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  // =========================
  // RETURN
  // =========================

  return (
    <div className="profile-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="profile-header">
        <div>
          <h1>My Profile</h1>

          <p>
            Manage your personal information and
            career details.
          </p>
        </div>
      </div>

      {/* =========================
          PROFILE OVERVIEW
          ========================= */}

      <div className="profile-overview">

        {/* Avatar Section */}

        <div className="profile-avatar-wrapper">

          <div className="profile-avatar">

            {profile.avatar ? (
              <img
                src={`${API}${profile.avatar}`}
                alt="Profile"
              />
            ) : (
              initials
            )}

          </div>

          {/* Upload Input */}

          <input
            type="file"
            id="profile-picture-upload"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleAvatarUpload}
            hidden
          />

          {/* Upload Button */}

          <label
            htmlFor="profile-picture-upload"
            className="upload-avatar-button"
          >
            📷 {saving
              ? "Uploading..."
              : "Change Photo"}
          </label>

          <span className="avatar-help">
            JPG, PNG or WEBP · Max 5 MB
          </span>

        </div>

        {/* Basic Information */}

        <div className="profile-basic-info">

          <h2>{profile.name}</h2>

          <p>{profile.email}</p>

          {profile.college && (
            <span className="profile-college">
              🎓 {profile.college}
            </span>
          )}

        </div>

      </div>

      {/* =========================
          MESSAGES
          ========================= */}

      {message && (
        <div className="profile-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {/* =========================
          PROFILE FORM
          ========================= */}

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >

        {/* =========================
            PERSONAL INFORMATION
            ========================= */}

        <div className="profile-section">

          <h2>Personal Information</h2>

          <p>
            Update your personal details.
          </p>

          <div className="profile-grid">

            {/* Full Name */}

            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>

            {/* Email */}

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                value={profile.email}
                disabled
              />

              <small>
                Email cannot be changed.
              </small>

            </div>

            {/* Phone */}

            <div className="form-group">

              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

            </div>

            {/* College */}

            <div className="form-group">

              <label>College</label>

              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter college name"
              />

            </div>

          </div>
        </div>

        {/* =========================
            CAREER INFORMATION
            ========================= */}

        <div className="profile-section">

          <h2>Career Information</h2>

          <p>
            Tell recruiters about your skills and
            experience.
          </p>

          {/* Skills */}

          <div className="form-group">

            <label>Skills</label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Python"
            />

            <small>
              Separate skills using commas.
            </small>

          </div>

          {/* Bio */}

          <div className="form-group">

            <label>Bio</label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short introduction about yourself..."
              rows={5}
            />

          </div>

          {/* =========================
              RESUME
              ========================= */}

          <div className="form-group">

            <label>Resume</label>

            <div className="resume-upload-box">

              <input
                type="file"
                id="resume-upload"
                accept="application/pdf,.pdf"
                onChange={async (e) => {

                  const file =
                    e.target.files?.[0];

                  if (!file) return;

                  if (
                    file.type !==
                    "application/pdf"
                  ) {
                    setError(
                      "Only PDF files are allowed."
                    );
                    return;
                  }

                  if (
                    file.size >
                    5 * 1024 * 1024
                  ) {
                    setError(
                      "Resume must be smaller than 5 MB."
                    );
                    return;
                  }

                  try {

                    setSaving(true);
                    setError("");
                    setMessage("");

                    const uploadData =
                      new FormData();

                    uploadData.append(
                      "resume",
                      file
                    );

                    const response =
                      await fetch(
                        `${API}/student/profile/resume`,
                        {
                          method: "POST",
                          headers: {
                            Authorization:
                              `Bearer ${token}`,
                          },
                          body: uploadData,
                        }
                      );

                    const result =
                      await response.json();

                    if (
                      !response.ok ||
                      !result.success
                    ) {
                      throw new Error(
                        result.message ||
                          "Resume upload failed"
                      );
                    }

                    setProfile(
                      result.data
                    );

                    setFormData(
                      (prev) => ({
                        ...prev,
                        resume:
                          result.resumeUrl,
                      })
                    );

                    setMessage(
                      "Resume uploaded successfully!"
                    );

                  } catch (
                    err: any
                  ) {

                    setError(
                      err.message ||
                        "Failed to upload resume"
                    );

                  } finally {

                    setSaving(false);

                  }

                }}
              />

              <label
                htmlFor="resume-upload"
                className="upload-resume-button"
              >
                📄 Upload Resume
              </label>

              <span className="resume-help">
                PDF only · Maximum 5 MB
              </span>

            </div>

            {/* Current Resume */}

            {profile.resume && (
              <a
                href={`${API}${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-view-link"
              >
                👁 View Current Resume
              </a>
            )}

          </div>

        </div>

        {/* =========================
            SAVE BUTTON
            ========================= */}

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

export default Profile;