import { useEffect, useState } from "react";
import Card from "../../components/Card";
import StatusMessage from "../../components/StatusMessage";
import { createRoom, getRooms } from "../../services/api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    room_number: "",
    room_type: "MRI",
    status: "available",
  });

  const loadRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.log("Failed to load rooms");
    }
  };

  useEffect(() => {
    loadRooms();
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
      await createRoom(form);

      setStatus({
        message: "Room created successfully",
        type: "success",
      });

      setForm({
        room_number: "",
        room_type: "MRI",
        status: "available",
      });

      loadRooms();
    } catch (error) {
      setStatus({
        message:
          error.response?.data?.error ||
          "Failed to create room",
        type: "error",
      });
    }
  };

  return (
    <section className="grid-two">
      <Card title="Add Room" subtitle="Create radiology room">
        <form className="form one" onSubmit={submit}>
          <input
            name="room_number"
            placeholder="MRI-101"
            value={form.room_number}
            onChange={change}
            required
          />

          <select
            name="room_type"
            value={form.room_type}
            onChange={change}
          >
            <option value="MRI">MRI</option>
            <option value="CT">CT</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Ultrasound">Ultrasound</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={change}
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button className="primary-btn">
            Create Room
          </button>
        </form>

        <StatusMessage status={status} />
      </Card>

      <Card title="Rooms" subtitle="Existing rooms">
        <div className="list">
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className="list-row"
            >
              <div>
                <strong>{room.room_number}</strong>
                <span>{room.room_type}</span>
              </div>

              <b className="pill">
                {room.status}
              </b>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}