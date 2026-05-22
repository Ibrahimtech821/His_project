import { useState } from "react";
import { createRadiologyReport } from "../../services/api";
import Card from "../../components/Card";
import Status from "../../components/Status";

export default function ReportCreation() {
  const [form, setForm] = useState({
    exam_id: "",
    radiologist_id: "",
    findings: "",
    impression: "",
    recommendation: "",
    report_date: "",
    report_status: "final",
  });

  const [status, setStatus] = useState({ message: "", type: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createRadiologyReport(form);
      setStatus({ message: "Radiology report created successfully.", type: "success" });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || "Failed to create report.", type: "error" });
    }
  };

  return (
    <Card title="Create Radiology Report" subtitle="Add findings, impression, recommendation, date, and status">
      <form className="form" onSubmit={submit}>
        <input name="exam_id" placeholder="Exam ID" value={form.exam_id} onChange={change} required />
        <input name="radiologist_id" placeholder="Radiologist ID" value={form.radiologist_id} onChange={change} required />
        <input name="report_date" type="date" value={form.report_date} onChange={change} />
        <select name="report_status" value={form.report_status} onChange={change}>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
        </select>
        <textarea name="findings" placeholder="Findings" value={form.findings} onChange={change} required />
        <textarea name="impression" placeholder="Impression" value={form.impression} onChange={change} required />
        <textarea name="recommendation" placeholder="Recommendation" value={form.recommendation} onChange={change} />
        <button className="primary-btn full">Create Report</button>
      </form>
      <Status status={status} />
    </Card>
  );
}
