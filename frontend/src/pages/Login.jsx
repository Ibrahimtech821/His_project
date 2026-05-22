import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Status from "../components/Status";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginType, setLoginType] = useState("patient");
  const [employeeRole, setEmployeeRole] = useState("admin");
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ message: "", type: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const goToRoleHome = (role) => {
    const paths = {
      patient: "/patient/dashboard",
      admin: "/admin/dashboard",
      physician: "/physician/dashboard",
      technician: "/technician/dashboard",
      radiologist: "/radiologist/dashboard",
    };
    navigate(paths[role] || "/");
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const finalRole = loginType === "patient" ? "patient" : employeeRole;
      await login(loginType, form, employeeRole);
      goToRoleHome(finalRole);
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "Login failed. Please check your email and password.",
        type: "error",
      });
    }
  };

  return (
    <main className="login-screen">
      <section className="login-visual">
        <div className="login-overlay">
          <div className="public-brand">
            <div className="brand-mark">R</div>
            <div>
              <h1>RadixCare</h1>
              <p>Radiology Hospital Information System</p>
            </div>
          </div>

          <div className="login-copy">
            <span>Secure Clinical Access</span>
            <h2>Professional radiology management for patients and hospital staff.</h2>
            <p>
              Appointments, scan requests, exam scheduling, medical images, and final reports in a clean hospital portal.
            </p>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <h2>Sign in</h2>
          <p>Access your hospital workspace</p>

          <div className="switch">
            <button type="button" className={loginType === "patient" ? "active" : ""} onClick={() => setLoginType("patient")}>
              Patient
            </button>
            <button type="button" className={loginType === "employee" ? "active" : ""} onClick={() => setLoginType("employee")}>
              Employee
            </button>
          </div>

          {loginType === "employee" && (
            <select className="role-select" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="physician">Physician</option>
              <option value="technician">Technician</option>
              <option value="radiologist">Radiologist</option>
            </select>
          )}

          <form className="form one" onSubmit={submit}>
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={change} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
            <button className="primary-btn">Login</button>
          </form>

          <Status status={status} />

          <p className="auth-note">
            New patient? <Link to="/register">Create patient account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
