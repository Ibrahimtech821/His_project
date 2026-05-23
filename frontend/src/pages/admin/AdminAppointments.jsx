import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { getAppointments, updateAppointmentStatus } from "../../services/api";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });

  const load = async () => {
    try {
      const res = await getAppointments();
      const list = res.data?.appointments || res.data || [];
      setAppointments(Array.isArray(list) ? list : []);
    } catch {
      setStatus({ message: "Could not load appointments.", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (appointment_id, appointment_status) => {
    try {
      const res = await updateAppointmentStatus(appointment_id, appointment_status);
      setAppointments((current) =>
        current.filter((appointment) => appointment.appointment_id !== appointment_id)
      );
      setStatus({
        message: res.data?.message || `Appointment #${appointment_id} updated.`,
        type: "success",
      });
    } catch (error) {
      setStatus({
        message: error.response?.data?.error || "Failed to update appointment.",
        type: "error",
      });
    }
  };

  const pendingAppointments = appointments.filter((appointment) => appointment.appointment_status === "pending");

  return (
    <Card title="Appointment Review" subtitle="Accept or reject pending patient appointments">
      <div className="list">
        {pendingAppointments.length === 0 ? (
          <EmptyState title="No pending appointments" text="New appointment requests will appear here." />
        ) : (
          pendingAppointments.map((appointment) => (
            <div className="request-row" key={appointment.appointment_id}>
              <div>
                <strong>Appointment #{appointment.appointment_id}</strong>
                <span>Patient: {appointment.patient_name || `#${appointment.patient_id}`}</span>
                <span>Doctor: {appointment.physician_name || `#${appointment.physician_id}`}</span>
                <span>{appointment.appointment_datetime}</span>
              </div>
              <div className="button-group">
                <button type="button" className="mini-btn success" onClick={() => changeStatus(appointment.appointment_id, "scheduled")}>Accept</button>
                <button type="button" className="mini-btn danger" onClick={() => changeStatus(appointment.appointment_id, "cancelled")}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      <StatusMessage status={status} />
    </Card>
  );
}