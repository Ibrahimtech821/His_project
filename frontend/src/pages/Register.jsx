import { useState } from "react";
import { Link } from "react-router-dom";
import { registerPatient } from "../services/api";
import Status from "../components/Status";

export default function Register() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    street: "",
    state: "",
    city: "",
    sex: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient(form);
      setStatus({ message: "Patient account created successfully.", type: "success" });
      setForm({ fname: "", lname: "", email: "", password: "", street: "", state: "", city: "", sex: "" });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || "Registration failed.", type: "error" });
    }
  };

  return (
    <main className="register-screen">
      <section className="register-shell">
        <div className="register-photo"></div>

        <div className="register-form">
          <div className="public-brand compact">
            <div className="brand-mark">R</div>
            <div>
              <h1>Patient Registration</h1>
              <p>Create your account</p>
            </div>
          </div>

          <form className="form" onSubmit={submit}>
            <input name="fname" placeholder="First name" value={form.fname} onChange={change} required />
            <input name="lname" placeholder="Last name" value={form.lname} onChange={change} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
            <input name="street" placeholder="Street" value={form.street} onChange={change} />
            <input name="state" placeholder="State" value={form.state} onChange={change} />
            <input name="city" placeholder="City" value={form.city} onChange={change} />
            <select name="sex" value={form.sex} onChange={change} required>
              <option value="">Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button className="primary-btn full">Register</button>
          </form>

          <Status status={status} />

          <p className="auth-note">
            Already registered? <Link to="/">Back to login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
