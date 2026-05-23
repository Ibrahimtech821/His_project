import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { getPatientExamOrders, updateExamConfirmation } from "../../services/api";

export default function PatientExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });

  const load = async () => {
    try {
      const res = await getPatientExamOrders(user.patient_id);
      const list = Array.isArray(res.data) ? res.data : [];
      setExams(list.filter((exam) => exam.patient_confirmation_status === "pending"));
    } catch {
      setStatus({ message: "Could not load scheduled exams.", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (exam_id, responseStatus) => {
    try {
      await updateExamConfirmation(exam_id, responseStatus);
      setExams((current) => current.filter((exam) => exam.exam_id !== exam_id));
      setStatus({ message: `Exam ${responseStatus} successfully.`, type: "success" });
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to update exam response.", type: "error" });
    }
  };

  return (
    <Card title="Scheduled Radiology Exams" subtitle="Only pending exams are shown here">
      <div className="list">
        {exams.length === 0 ? (
          <EmptyState title="No scheduled exams" text="Scheduled exam orders will appear after admin scheduling." />
        ) : (
          exams.map((exam) => (
            <div className="exam-card" key={exam.exam_id}>
              <div>
                <strong>Exam #{exam.exam_id}</strong>
                <span>Room #{exam.room_id}</span>
                <span>{exam.scheduled_datetime}</span>
                {exam.technician_name && <span>Technician: {exam.technician_name}</span>}
              </div>

              <div className="exam-actions">
                <b className="pill">{exam.patient_confirmation_status}</b>
                <button className="mini-btn success" onClick={() => respond(exam.exam_id, "confirmed")}>
                  Confirm
                </button>
                <button className="mini-btn danger" onClick={() => respond(exam.exam_id, "declined")}>
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <StatusMessage status={status} />
    </Card>
  );
}
