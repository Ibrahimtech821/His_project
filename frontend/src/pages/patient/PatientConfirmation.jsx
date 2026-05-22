import { useState } from "react";
import { confirmExamOrder } from "../../services/api";
import Card from "../../components/Card";
import Status from "../../components/Status";

export default function PatientConfirmation() {
  const [form, setForm] = useState({ exam_id: "", patient_id: "", confirmation_status: "confirmed" });
  const [status, setStatus] = useState({ message: "", type: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await confirmExamOrder(form.exam_id, {
        patient_id: form.patient_id,
        confirmation_status: form.confirmation_status,
      });
      setStatus({ message: "Exam response saved successfully.", type: "success" });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || "Failed to save confirmation.", type: "error" });
    }
  };

  return (
    <Card title="Scheduled Exam Confirmation" subtitle="Confirm or decline your scheduled radiology exam">
      <form className="form" onSubmit={submit}>
        <input name="exam_id" placeholder="Exam ID" value={form.exam_id} onChange={change} required />
        <input name="patient_id" placeholder="Patient ID" value={form.patient_id} onChange={change} required />
        <select name="confirmation_status" value={form.confirmation_status} onChange={change}>
          <option value="confirmed">Confirm</option>
          <option value="declined">Decline</option>
        </select>
        <button className="primary-btn full">Submit Response</button>
      </form>
      <Status status={status} />
    </Card>
  );
}
