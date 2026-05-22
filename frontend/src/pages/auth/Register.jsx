import { useState } from "react";
import { Link } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { registerPatient } from "../../services/api";

export default function Register() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    street: "",
    state: "",
    city: "",
    sex: "male",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerPatient(form);
      setStatus({ message: "Patient account created successfully. You can login now.", type: "success" });
      setForm({ fname: "", lname: "", email: "", password: "", street: "", state: "", city: "", sex: "male" });
    } catch (error) {
      setStatus({
        message: error.response?.data?.error || error.response?.data?.message || "Registration failed.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-screen">
      <section className="register-shell">
        <div className="register-photo">
          <div>
            <span>Patient access</span>
            <h1>Create your hospital imaging account.</h1>
          </div>
        </div>

        <div className="register-card">
          <div className="auth-brand compact">
            <div className="brand-mark">R</div>
            <div>
              <h2>Patient Registration</h2>
              <p>Fill in your details to continue.</p>
            </div>
          </div>

          <form className="form" onSubmit={submit}>
            <input name="fname" placeholder="First name" value={form.fname} onChange={change} required />
            <input name="lname" placeholder="Last name" value={form.lname} onChange={change} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
            <input name="street" placeholder="Street" value={form.street} onChange={change} required />
            <input name="state" placeholder="State" value={form.state} onChange={change} required />
            <input name="city" placeholder="City" value={form.city} onChange={change} required />
            <select name="sex" value={form.sex} onChange={change} required>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <button className="primary-btn full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <StatusMessage status={status} />

          <p className="auth-note">
            Already have account? <Link to="/">Back to login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
