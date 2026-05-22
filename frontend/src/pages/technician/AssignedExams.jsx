import Card from "../../components/Card";

export default function AssignedExams() {
  return (
    <Card title="Assigned Scheduled Exams" subtitle="Technician exam queue">
      <div className="list">
        <div className="list-row">
          <strong>Assigned exams list</strong>
          <span>Connect to a backend endpoint when available.</span>
        </div>
      </div>
    </Card>
  );
}
