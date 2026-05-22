import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";

const homeByRole = {
  patient: "/patient/dashboard",
  admin: "/admin/dashboard",
  physician: "/physician/dashboard",
  technician: "/technician/dashboard",
  radiologist: "/radiologist/dashboard",
};

export default function Login() {
  const [accountType, setAccountType] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const user = await login(accountType, form);
      navigate(homeByRole[user.role] || "/");
    } catch (error) {
      setStatus({
        message: error.response?.data?.error || error.response?.data?.message || "Login failed. Check your email and password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-visual">
        <div className="auth-brand">
          <div className="brand-mark">R</div>
          <div>
            <h1>RadixCare</h1>
            <p>Radiology Hospital Information System</p>
          </div>
        </div>

        <div className="auth-copy">
          <span>Secure clinical portal</span>
          <h2>Modern imaging operations for patients and radiology teams.</h2>
          <p>
            A polished hospital interface for booking appointments, handling scan requests,
            scheduling exams, uploading images, and creating final reports.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Sign in</h2>
          <p>Choose your account type and continue.</p>

          <div className="account-switch">
            <button
              type="button"
              className={accountType === "patient" ? "active" : ""}
              onClick={() => setAccountType("patient")}
            >
              Patient
            </button>
            <button
              type="button"
              className={accountType === "employee" ? "active" : ""}
              onClick={() => setAccountType("employee")}
            >
              Employee
            </button>
          </div>

          <form className="form one" onSubmit={submit}>
            <input
              name="email"
              type="email"
              placeholder={accountType === "employee" ? "Employee email" : "Patient email"}
              value={form.email}
              onChange={change}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={change}
              required
            />

            <button className="primary-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <StatusMessage status={status} />

          <p className="auth-note">
            New patient? <Link to="/register">Create account</Link>
          </p>

          <div className="seed-note">
            First admin example: <b>admin@his.com</b> / <b>admin123</b>
          </div>
        </div>
      </section>
    </main>
  );
}
