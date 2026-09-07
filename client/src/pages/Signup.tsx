import { useState } from "react";
import "./Auth.css";
const API = import.meta.env.PROD
  ? "https://skillhire-ai-backend.onrender.com/api"
  : "http://localhost:5000/api";
interface SignupProps {
  onLogin: () => void;
}

const Signup = ({ onLogin }: SignupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Registration failed."
        );
      }

      console.log("Signup response:", result);

      setSuccess(
        "Account created successfully! Please login."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
      });

    } catch (err: any) {
      setError(
        err.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="auth-left">

        <div className="auth-brand">
          <div className="brand-logo">S</div>
          <span>SkillHire AI</span>
        </div>

        <div className="auth-hero">

          <span className="auth-badge">
            BUILD YOUR FUTURE
          </span>

          <h1>
            Turn your skills
            <br />
            into <span>opportunities.</span>
          </h1>

          <p>
            Create your SkillHire AI account and connect
            with the right opportunities for your career.
          </p>

          <div className="auth-features">

            <div className="auth-feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Discover opportunities
                </strong>

                <span>
                  Find jobs that match your skills.
                </span>
              </div>

            </div>

            <div className="auth-feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Build your profile
                </strong>

                <span>
                  Showcase your skills and experience.
                </span>
              </div>

            </div>

            <div className="auth-feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Track applications
                </strong>

                <span>
                  Manage your job applications easily.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="auth-right">

        <div className="auth-card">

          {/* Mobile Logo */}

          <div className="mobile-brand">

            <div className="brand-logo">
              S
            </div>

            <span>
              SkillHire AI
            </span>

          </div>

          {/* Heading */}

          <div className="auth-heading">

            <h2>
              Create your account
            </h2>

            <p>
              Start your journey with SkillHire AI
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="auth-message success">
              {success}
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            {/* Email */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* Role */}

            <div className="form-group">

              <label>
                Account Type
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >

                <option value="student">
                  Student
                </option>

                <option value="recruiter">
                  Recruiter
                </option>

              </select>

            </div>

            {/* Password */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />

              </div>

              {/* Confirm Password */}

              <div className="form-group">

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

          {/* Login */}

          <div className="auth-divider">
            <span>
              Already have an account?
            </span>
          </div>

          <button
            type="button"
            className="auth-secondary"
            onClick={onLogin}
          >
            Sign in to your account
          </button>

          {/* Footer */}

          <p className="auth-footer">
            By creating an account, you agree to our
            Terms of Service and Privacy Policy.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;