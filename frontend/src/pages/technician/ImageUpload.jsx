import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { getTechnicianExamOrders, uploadRadiologyImageFile } from "../../services/api";

export default function ImageUpload() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ exam_id: "", image_path: "", upload_date: "" });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });

  const loadExams = () => {
    getTechnicianExamOrders(user.employee_id)
      .then((res) =>
        setExams(
          Array.isArray(res.data)
            ? res.data.filter((exam) => exam.patient_confirmation_status === "confirmed")
            : []
        )
      )
      .catch(() => setExams([]));
  };

  useEffect(() => {
    loadExams();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        setStatus({ message: "Please choose an image file.", type: "error" });
        return;
      }

      const fd = new FormData();
      fd.append("image", file);
      fd.append("exam_id", form.exam_id);
      if (form.upload_date) fd.append("upload_date", form.upload_date);

      await uploadRadiologyImageFile(fd);

      setStatus({ message: "Image record saved successfully.", type: "success" });
      setForm({ exam_id: "", image_path: "", upload_date: "" });
      setFile(null);
      loadExams();
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to save image record.", type: "error" });
    }
  };

  return (
    <Card title="Upload Scan Image Record" subtitle="Select assigned exam and save image path">
      <form className="form" onSubmit={submit}>
        <select name="exam_id" value={form.exam_id} onChange={change} required>
          <option value="">Select exam</option>
          {exams.map((exam) => (
            <option key={exam.exam_id} value={exam.exam_id}>
              Exam #{exam.exam_id} — Room #{exam.room_id} — {exam.scheduled_datetime}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        <input name="upload_date" type="date" value={form.upload_date} onChange={change} />

        <button className="primary-btn full">Save Image</button>
      </form>

      {exams.length === 0 ? (
        <EmptyState title="No confirmed exams" text="You can upload images only after an exam is confirmed." />
      ) : null}

      <StatusMessage status={status} />
    </Card>
  );
}
