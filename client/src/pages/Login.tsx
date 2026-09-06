import { useState } from "react";
import "./Auth.css";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
interface LoginProps {
  onSignup: () => void;
  onLoginSuccess: () => void;
}

const Login = ({ onSignup, onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Invalid email or password."
        );
      }

      //console.log("Login response:", result);
      console.log("FULL LOGIN RESPONSE:", result);
      console.log("LOGIN DATA:", result.data);
      console.log("TOKEN:", result.data?.token);
      console.log("USER:", result.data?.user);

      // Store JWT
      if (result.data?.token) {


        
        localStorage.setItem("token", result.data.token);
      } else if (result.token) {
        localStorage.setItem("token", result.token);
      }

      // Store user information if returned
      if (result.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(result.data.user)
        );
      } else if (result.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(
        err.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}

      <div className="auth-left">

        <div className="auth-brand">
          <div className="brand-logo">S</div>
          <span>SkillHire AI</span>
        </div>

        <div className="auth-hero">

          <span className="auth-badge">
            FIND YOUR NEXT OPPORTUNITY
          </span>

          <h1>
            Your skills.
            <br />
            Your <span>future.</span>
          </h1>

          <p>
            Connect with opportunities that match your
            skills, experience and career goals.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Smart job discovery</strong>
                <span>
                  Find relevant opportunities quickly.
                </span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Manage applications</strong>
                <span>
                  Track your applications in one place.
                </span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Build your career</strong>
                <span>
                  Showcase your skills to recruiters.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-brand">
            <div className="brand-logo">S</div>
            <span>SkillHire AI</span>
          </div>

          <div className="auth-heading">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to SkillHire AI
            </p>

          </div>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <div className="password-label">

                <label>Password</label>

                <span>Forgot password?</span>

              </div>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button
            className="auth-secondary"
            onClick={onSignup}
          >
            Create an account
          </button>

          <p className="auth-footer">
            By continuing, you agree to our Terms of
            Service and Privacy Policy.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;