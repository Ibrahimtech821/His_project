import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { getReports } from "../../services/api";

export default function PatientReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports()
      .then((res) => setReports(Array.isArray(res.data) ? res.data : []))
      .catch(() => setReports([]));
  }, []);

  return (
    <Card title="Radiology Reports" subtitle="Final reports available in the system">
      <div className="report-grid">
        {reports.length === 0 ? (
          <EmptyState title="No reports yet" text="Completed reports will appear here." />
        ) : (
          reports.map((report) => (
            <article className="report-card" key={report.report_id}>
              <div>
                <span>Report #{report.report_id}</span>
                <h3>Exam #{report.exam_id}</h3>
              </div>
              <p><b>Findings:</b> {report.findings || "Not added"}</p>
              <p><b>Impression:</b> {report.impression || "Not added"}</p>
              <p><b>Recommendation:</b> {report.recommendation || "Not added"}</p>
              <b className="pill">{report.report_status}</b>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
