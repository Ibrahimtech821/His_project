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

  const loadCompletedExams = () => {
    getCompletedExams(user?.employee_id)
      .then((res) => setCompletedExams(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCompletedExams([]));
  };

  useEffect(() => {
    loadCompletedExams();
  }, [user?.employee_id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectedExam = completedExams.find((exam) => String(exam.exam_id) === String(form.exam_id));

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createRadiologyReport({
        ...form,
      });

      setStatus({ message: "Radiology report created successfully.", type: "success" });
      setForm({ exam_id: "", findings: "", impression: "", recommendation: "", report_date: "", report_status: "completed" });
      loadCompletedExams();
    } catch (error) {
      setStatus({
        message: error.response?.data?.error || error.response?.data?.message || "Failed to create report.",
        type: "error",
      });
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

        <textarea name="findings" placeholder="Findings" value={form.findings} onChange={change} />
        <textarea name="impression" placeholder="Impression" value={form.impression} onChange={change} />
        <textarea name="recommendation" placeholder="Recommendation" value={form.recommendation} onChange={change} />

        <button className="primary-btn full">Create Report</button>
      </form>

      {selectedExam?.images?.length ? (
        <div className="list" style={{ marginTop: 16 }}>
          <strong>Scan Images for Exam #{selectedExam.exam_id}</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
            {(selectedExam.image_urls || []).map((src, index) => (
              <a key={`${src}-${index}`} href={src} target="_blank" rel="noreferrer" style={{ display: "block" }}>
                <img
                  src={src}
                  alt={`Exam ${selectedExam.exam_id} scan ${index + 1}`}
                  style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12 }}
                />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <StatusMessage status={status} />
    </Card>
  );
}
