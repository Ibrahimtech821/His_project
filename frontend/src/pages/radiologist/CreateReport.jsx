import { useState } from "react";
import Card from "../../components/Card";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { createRadiologyReport, getCompletedExams } from "../../services/api";
import { useEffect } from "react";

export default function CreateReport() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    exam_id: "",
    findings: "",
    impression: "",
    recommendation: "",
    report_date: "",
    report_status: "completed",
  });

  const [status, setStatus] = useState({ message: "", type: "" });
  const [completedExams, setCompletedExams] = useState([]);

  useEffect(() => {
    getCompletedExams()
      .then((res) => setCompletedExams(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCompletedExams([]));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createRadiologyReport({
        ...form,
        radiologist_id: user.employee_id,
      });

      setStatus({ message: "Radiology report created successfully.", type: "success" });
      setForm({ exam_id: "", findings: "", impression: "", recommendation: "", report_date: "", report_status: "completed" });
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to create report.", type: "error" });
    }
  };

  return (
    <Card title="Create Radiology Report" subtitle="Radiologist ID is taken automatically from login">
      <form className="form" onSubmit={submit}>
        <select name="exam_id" value={form.exam_id} onChange={change} required>
          <option value="">Select completed exam</option>
          {completedExams.map((exam) => (
            <option key={exam.exam_id} value={exam.exam_id}>
              Exam #{exam.exam_id} — Room #{exam.room_id} — {exam.scheduled_datetime}
            </option>
          ))}
        </select>
        <input name="report_date" type="date" value={form.report_date} onChange={change} />

        <select name="report_status" value={form.report_status} onChange={change}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="reviewed">Reviewed</option>
        </select>

        <textarea name="findings" placeholder="Findings" value={form.findings} onChange={change} />
        <textarea name="impression" placeholder="Impression" value={form.impression} onChange={change} />
        <textarea name="recommendation" placeholder="Recommendation" value={form.recommendation} onChange={change} />

        <button className="primary-btn full">Create Report</button>
      </form>

      <StatusMessage status={status} />
    </Card>
  );
}
