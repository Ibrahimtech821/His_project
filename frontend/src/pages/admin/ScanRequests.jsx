import { useState } from "react";
import { acceptScanRequest } from "../../services/api";
import Card from "../../components/Card";
import Status from "../../components/Status";

export default function ScanRequests() {
  const [request_id, setRequestId] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });

  const accept = async () => {
    try {
      await acceptScanRequest(request_id);
      setStatus({ message: "Scan request accepted successfully.", type: "success" });
      setRequestId("");
    } catch (error) {
      setStatus({ message: error.response?.data?.message || "Failed to accept request.", type: "error" });
    }
  };

  return (
    <section className="grid-two">
      <Card title="Scan Requests" subtitle="Review requests created by physicians">
        <div className="list">
          <div className="list-row">
            <strong>Connect request list endpoint</strong>
            <span>Your given backend only includes accept request endpoint.</span>
          </div>
        </div>
      </Card>

      <Card title="Accept Scan Request" subtitle="PUT /radiology/scan-requests/:request_id/accept">
        <div className="form one">
          <input placeholder="Request ID" value={request_id} onChange={(e) => setRequestId(e.target.value)} />
          <button className="primary-btn" onClick={accept}>Accept Request</button>
        </div>
        <Status status={status} />
      </Card>
    </section>
  );
}
