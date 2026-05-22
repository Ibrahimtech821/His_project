import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { getTechnicianExamOrders } from "../../services/api";

export default function TechnicianExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    getTechnicianExamOrders(user.employee_id)
      .then((res) => setExams(Array.isArray(res.data) ? res.data : []))
      .catch(() => setStatus({ message: "Could not load assigned exams.", type: "error" }));
  }, []);

  return (
    <Card title="Assigned Scheduled Exams" subtitle="Only exams assigned to logged-in technician">
      <div className="list">
        {exams.length === 0 ? (
          <EmptyState title="No assigned exams" text="Assigned exam orders will appear here." />
        ) : (
          exams.map((exam) => (
            <div className="exam-card" key={exam.exam_id}>
              <div>
                <strong>Exam #{exam.exam_id}</strong>
                <span>Request #{exam.request_id}</span>
                <span>Room #{exam.room_id}</span>
                <span>{exam.scheduled_datetime}</span>
              </div>
              <b className="pill">{exam.patient_confirmation_status}</b>
            </div>
          ))
        )}
      </div>

      <StatusMessage status={status} />
    </Card>
  );
}
