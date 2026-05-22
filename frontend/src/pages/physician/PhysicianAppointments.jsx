import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getAppointments } from "../../services/api";

export default function PhysicianAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments()
      .then((res) => {
        const list = res.data?.appointments || res.data || [];
        setAppointments(Array.isArray(list) ? list.filter((a) => Number(a.physician_id) === Number(user.employee_id)) : []);
      })
      .catch(() => setAppointments([]));
  }, []);

  return (
    <Card title="My Patient Appointments" subtitle="Appointments assigned to the logged-in physician">
      <div className="list">
        {appointments.length === 0 ? (
          <EmptyState title="No appointments" text="Assigned patient appointments will appear here." />
        ) : (
          appointments.map((a) => (
            <div className="list-row" key={a.appointment_id}>
              <div>
                <strong>Appointment #{a.appointment_id}</strong>
                <span>Patient #{a.patient_id}</span>
                <span>{a.appointment_datetime}</span>
              </div>
              <b className="pill">{a.appointment_status}</b>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
