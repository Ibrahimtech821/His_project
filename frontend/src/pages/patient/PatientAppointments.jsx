import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { createAppointment, getAppointments, getPhysicians } from "../../services/api";

export default function PatientAppointments() {
  const { user } = useAuth();
  const [physicians, setPhysicians] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ physician_id: "", appointment_datetime: "" });
  const [status, setStatus] = useState({ message: "", type: "" });

  const load = async () => {
    try {
      const [physicianRes, appointmentRes] = await Promise.all([getPhysicians(), getAppointments()]);
      setPhysicians(Array.isArray(physicianRes.data) ? physicianRes.data : []);
      const list = appointmentRes.data?.appointments || appointmentRes.data || [];
      setAppointments(Array.isArray(list) ? list.filter((a) => Number(a.patient_id) === Number(user.patient_id)) : []);
    } catch {
      setStatus({ message: "Could not load appointment data.", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createAppointment({
        patient_id: user.patient_id,
        physician_id: form.physician_id,
        appointment_datetime: form.appointment_datetime,
      });

      setStatus({ message: "Appointment booked successfully.", type: "success" });
      setForm({ physician_id: "", appointment_datetime: "" });
      load();
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to book appointment.", type: "error" });
    }
  };

  return (
    <section className="grid-two">
      <Card title="Book Appointment" subtitle="Choose physician by name from the database">
        <form className="form one" onSubmit={submit}>
          <select name="physician_id" value={form.physician_id} onChange={(e) => setForm({ ...form, physician_id: e.target.value })} required>
            <option value="">Select physician</option>
            {physicians.map((doctor) => (
              <option key={doctor.employee_id} value={doctor.employee_id}>
                Dr. {doctor.full_name || `${doctor.fname} ${doctor.lname}`} — {doctor.specialization}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={form.appointment_datetime}
            onChange={(e) => setForm({ ...form, appointment_datetime: e.target.value })}
            required
          />

          <button className="primary-btn">Book Appointment</button>
        </form>

        <StatusMessage status={status} />
      </Card>

      <Card title="My Appointments" subtitle="Patient-specific appointments">
        <div className="list">
          {appointments.length === 0 ? (
            <EmptyState title="No appointments yet" text="Your booked appointments will appear here." />
          ) : (
            appointments.map((a) => (
              <div className="list-row" key={a.appointment_id}>
                <div>
                  <strong>Appointment #{a.appointment_id}</strong>
                  <span>{a.appointment_datetime}</span>
                </div>
                <b className="pill">{a.appointment_status}</b>
              </div>
            ))
          )}
        </div>
      </Card>
    </section>
  );
}
