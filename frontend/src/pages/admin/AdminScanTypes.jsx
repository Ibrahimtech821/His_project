import { useEffect, useState } from "react";
import Card from "../../components/Card";
import StatusMessage from "../../components/StatusMessage";
import {
  createScanType,
  getScanTypes,
} from "../../services/api";

export default function AdminScanTypes() {
  const [scanTypes, setScanTypes] = useState([]);
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });

  const [form, setForm] = useState({
    scan_name: "",
    modality: "",
    description: "",
  });

  const loadScanTypes = async () => {
    try {
      const res = await getScanTypes();
      setScanTypes(
        Array.isArray(res.data) ? res.data : []
      );
    } catch {
      console.log("Failed to load scan types");
    }
  };

  useEffect(() => {
    loadScanTypes();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createScanType(form);

      setStatus({
        message:
          "Scan type created successfully",
        type: "success",
      });

      setForm({
        scan_name: "",
        modality: "",
        description: "",
      });

      loadScanTypes();
    } catch (error) {
      setStatus({
        message:
          error.response?.data?.error ||
          "Failed to create scan type",
        type: "error",
      });
    }
  };

  return (
    <section className="grid-two">
      <Card
        title="Add Scan Type"
        subtitle="Create scan type"
      >
        <form className="form one" onSubmit={submit}>
          <input
            name="scan_name"
            placeholder="MRI Brain"
            value={form.scan_name}
            onChange={change}
            required
          />

          <input
            name="modality"
            placeholder="MRI"
            value={form.modality}
            onChange={change}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={change}
          />

          <button className="primary-btn">
            Create Scan Type
          </button>
        </form>

        <StatusMessage status={status} />
      </Card>

      <Card
        title="Scan Types"
        subtitle="Existing scan types"
      >
        <div className="list">
          {scanTypes.map((scan) => (
            <div
              key={scan.scan_type_id}
              className="list-row"
            >
              <div>
                <strong>
                  {scan.scan_name}
                </strong>

                <span>
                  {scan.modality}
                </span>

                <span>
                  {scan.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}