import { useState } from "react";
import Card from "../../components/Card";
import StatusMessage from "../../components/StatusMessage";
import { createEmployee } from "../../services/api";

export default function EmployeeCreation() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    street: "",
    state: "",
    city: "",
    specialization: "",
    sex: "male",
    employee_type: "physician",
    degree: "",
    medical_license_num: "",
    radiologist_license_num: "",
    technical_certification: "",
    experience_years: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createEmployee(form);
      setStatus({ message: `${form.employee_type} account created successfully.`, type: "success" });
      setForm({
        fname: "",
        lname: "",
        email: "",
        password: "",
        street: "",
        state: "",
        city: "",
        specialization: "",
        sex: "male",
        employee_type: "physician",
        degree: "",
        medical_license_num: "",
        radiologist_license_num: "",
        technical_certification: "",
        experience_years: "",
      });
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to create employee.", type: "error" });
    }
  };

  return (
    <Card title="Create Employee Account" subtitle="Create hospital staff accounts from one professional form">
      <form className="form" onSubmit={submit}>
        <input name="fname" placeholder="First name" value={form.fname} onChange={change} required />
        <input name="lname" placeholder="Last name" value={form.lname} onChange={change} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />

        <input name="street" placeholder="Street" value={form.street} onChange={change} required />
        <input name="state" placeholder="State" value={form.state} onChange={change} required />
        <input name="city" placeholder="City" value={form.city} onChange={change} required />
        <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={change} required />

        <select name="sex" value={form.sex} onChange={change} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select name="employee_type" value={form.employee_type} onChange={change} required>
          <option value="admin">Admin</option>
          <option value="physician">Physician</option>
          <option value="technician">Technician</option>
          <option value="radiologist">Radiologist</option>
        </select>

        {(form.employee_type === "physician" || form.employee_type === "radiologist") && (
          <input name="degree" placeholder="Degree" value={form.degree} onChange={change} />
        )}

        {form.employee_type === "physician" && (
          <input name="medical_license_num" placeholder="Medical license number" value={form.medical_license_num} onChange={change} />
        )}

        {form.employee_type === "radiologist" && (
          <input name="radiologist_license_num" placeholder="Radiologist license number" value={form.radiologist_license_num} onChange={change} />
        )}

        {form.employee_type === "technician" && (
          <>
            <input name="technical_certification" placeholder="Technical certification" value={form.technical_certification} onChange={change} />
            <input name="experience_years" type="number" placeholder="Experience years" value={form.experience_years} onChange={change} />
          </>
        )}

        <button className="primary-btn full">Create Employee</button>
      </form>

      <StatusMessage status={status} />
    </Card>
  );
}
