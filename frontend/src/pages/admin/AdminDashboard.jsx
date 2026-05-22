import Hero from "../../components/Hero";
import Stats from "../../components/Stats";

export default function AdminDashboard() {
  return (
    <>
      <Hero
        eyebrow="Administration"
        title="Radiology department command center"
        text="Manage staff accounts, review physician scan requests, and schedule accepted exams with rooms and technicians."
        image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80"
      />

      <Stats
        items={[
          { label: "Employees", value: "Create", text: "Admin, physician, technician, radiologist" },
          { label: "Requests", value: "Accept", text: "Review pending scan requests" },
          { label: "Exams", value: "Schedule", text: "Assign room, technician, and time" },
          { label: "System", value: "Manage", text: "Operational dashboard" },
        ]}
      />
    </>
  );
}
