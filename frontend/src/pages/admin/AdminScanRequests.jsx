import { useEffect, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import StatusMessage from "../../components/StatusMessage";
import { useAuth } from "../../context/AuthContext";
import { acceptScanRequest, getScanRequests } from "../../services/api";

export default function AdminScanRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });

  const load = async () => {
    try {
      const res = await getScanRequests("pending");
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      setStatus({ message: "Could not load scan requests.", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const accept = async (request_id) => {
    try {
      await acceptScanRequest(request_id, user.employee_id);
      setStatus({ message: `Request #${request_id} accepted.`, type: "success" });
      load();
    } catch (error) {
      setStatus({ message: error.response?.data?.error || "Failed to accept request.", type: "error" });
    }
  };

  return (
    <Card title="Pending Scan Requests" subtitle="Review physician requests and accept them for scheduling">
      <div className="list">
        {requests.length === 0 ? (
          <EmptyState title="No pending requests" text="New physician scan requests will appear here." />
        ) : (
          requests.map((request) => (
            <div className="request-row" key={request.request_id}>
              <div>
                <strong>Request #{request.request_id}</strong>
                <span>Appointment #{request.appointment_id}</span>
                <span>Scan Type #{request.scan_type_id}</span>
                {request.reason && <p>{request.reason}</p>}
                {request.notes && <small>{request.notes}</small>}
              </div>
              <button className="mini-btn success" onClick={() => accept(request.request_id)}>
                Accept
              </button>
            </div>
          ))
        )}
      </div>

      <StatusMessage status={status} />
    </Card>
  );
}
