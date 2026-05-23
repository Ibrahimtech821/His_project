import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import {
  createExamOrder,
  getScanRequests,
  getTechnicians,
  getRooms,
  getRadiologists,
} from "../../services/api";

export default function ExamScheduling() {
  const { user } = useAuth();

  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [radiologists, setRadiologists] = useState([]);

  const [form, setForm] = useState({
    request_id: "",
    room_id: "",
    technician_id: "",
    radiologist_id: "",
    scheduled_datetime: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });

  const load = async () => {
    try {
      const [reqRes, techRes, roomRes, radiologistRes] = await Promise.all([
        getScanRequests("accepted"),
        getTechnicians(),
        getRooms(),
        getRadiologists(),
      ]);

      setAcceptedRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setTechnicians(Array.isArray(techRes.data) ? techRes.data : []);
      setRooms(Array.isArray(roomRes.data) ? roomRes.data : []);
      setRadiologists(Array.isArray(radiologistRes.data) ? radiologistRes.data : []);
    } catch {
      setStatus({
        message: "Could not load scheduling data.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createExamOrder({
        ...form,
        scheduled_by_admin_id: user.employee_id,
      });

      setStatus({
        message: "Exam scheduled successfully.",
        type: "success",
      });

      setForm({
        request_id: "",
        room_id: "",
        technician_id: "",
        radiologist_id: "",
        scheduled_datetime: "",
      });

      load();
    } catch (error) {
      setStatus({
        message:
          error.response?.data?.error || "Failed to schedule exam.",
        type: "error",
      });
    }
  };

  return (
    <section className="grid-two">
      <Card
        title="Schedule Exam"
        subtitle="Select accepted request, room, technician, and date"
      >
        <form className="form one" onSubmit={submit}>
          <select
            name="request_id"
            value={form.request_id}
            onChange={change}
            required
          >
            <option value="">Select accepted request</option>

            {acceptedRequests.map((request) => (
              <option
                key={request.request_id}
                value={request.request_id}
              >
                Request #{request.request_id} — Appointment #
                {request.appointment_id}
              </option>
            ))}
          </select>

          <select
            name="room_id"
            value={form.room_id}
            onChange={change}
            required
          >
            <option value="">Select available room</option>

            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                Room {room.room_number} — {room.room_type}
              </option>
            ))}
          </select>

          <select
            name="technician_id"
            value={form.technician_id}
            onChange={change}
            required
          >
            <option value="">Select technician</option>

            {technicians.map((tech) => (
              <option key={tech.employee_id} value={tech.employee_id}>
                {tech.full_name || `${tech.fname} ${tech.lname}`} —{" "}
                {tech.specialization}
              </option>
            ))}
          </select>

          <select
            name="radiologist_id"
            value={form.radiologist_id}
            onChange={change}
            required
          >
            <option value="">Assign radiologist</option>

            {radiologists.map((radiologist) => (
              <option key={radiologist.employee_id} value={radiologist.employee_id}>
                {radiologist.full_name || `${radiologist.fname} ${radiologist.lname}`} — {radiologist.specialization}
              </option>
            ))}
          </select>

          <input
            name="scheduled_datetime"
            type="datetime-local"
            value={form.scheduled_datetime}
            onChange={change}
            required
          />

          <button className="primary-btn">Schedule Exam</button>
        </form>

        <StatusMessage status={status} />
      </Card>

      <Card
        title="Accepted Requests"
        subtitle="Requests ready for scheduling"
      >
        <div className="list">
          {acceptedRequests.length === 0 ? (
            <EmptyState
              title="No accepted requests"
              text="Accept scan requests first, then schedule exams."
            />
          ) : (
            acceptedRequests.map((request) => (
              <div className="list-row" key={request.request_id}>
                <div>
                  <strong>Request #{request.request_id}</strong>
                  <span>Appointment #{request.appointment_id}</span>
                </div>

                <b className="pill">{request.request_status}</b>
              </div>
            ))
          )}
        </div>
      </Card>
    </section>
  );
}