import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { createScanRequest, getAppointments, getScanTypes } from "../../services/api";

export default function CreateScanRequest() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [scanTypes, setScanTypes] = useState([]);
  const [form, setForm] = useState({
    appointment_id: "",
    scan_type_id: "",
    reason: "",
    notes: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    Promise.all([getAppointments(), getScanTypes()])
      .then(([appointmentRes, scanTypeRes]) => {
        const appointmentList = appointmentRes.data?.appointments || appointmentRes.data || [];
        const scanTypeList = scanTypeRes.data || [];

        setAppointments(
          Array.isArray(appointmentList)
            ? appointmentList.filter(
                (a) =>
                  Number(a.physician_id) === Number(user.employee_id) &&
                  a.appointment_status === "scheduled"
              )
            : []
        );
        setScanTypes(Array.isArray(scanTypeList) ? scanTypeList : []);
      })
      .catch(() => {
        setAppointments([]);
        setScanTypes([]);
      });
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createScanRequest(form);
      setStatus({ message: "Scan request created successfully.", type: "success" });
      setForm({ appointment_id: "", scan_type_id: "", reason: "", notes: "" });
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to create scan request.", type: "error" });
    }
  };

  return (
    <section className="grid-two">
      <Card title="Create Scan Request" subtitle="Select appointment and scan type">
        <form className="form one" onSubmit={submit}>
          <select name="appointment_id" value={form.appointment_id} onChange={change} required>
            <option value="">Select appointment</option>
            {appointments.map((a) => (
              <option key={a.appointment_id} value={a.appointment_id}>
                Appointment #{a.appointment_id} — Patient #{a.patient_id} — {a.appointment_datetime}
              </option>
            ))}
          </select>

          <select name="scan_type_id" value={form.scan_type_id} onChange={change} required>
            <option value="">Select scan type</option>
            {scanTypes.map((scanType) => (
              <option key={scanType.scan_type_id} value={scanType.scan_type_id}>
                {scanType.scan_name}
                {scanType.modality ? ` — ${scanType.modality}` : ""}
              </option>
            ))}
          </select>
          <textarea name="reason" placeholder="Reason for scan" value={form.reason} onChange={change} />
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={change} />

          <button className="primary-btn">Submit Request</button>
        </form>

        <StatusMessage status={status} />
      </Card>

      <Card title="Appointments" subtitle="Only appointments assigned to you">
        <div className="list">
          {appointments.length === 0 ? (
            <EmptyState title="No accepted appointments" text="Only accepted appointments can be used for scan requests." />
          ) : (
            appointments.map((a) => (
              <div className="list-row" key={a.appointment_id}>
                <div>
                  <strong>Appointment #{a.appointment_id}</strong>
                  <span>Patient #{a.patient_id}</span>
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
