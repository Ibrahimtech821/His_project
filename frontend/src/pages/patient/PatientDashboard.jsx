import Hero from "../../components/Hero";
import Stats from "../../components/Stats";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Hero
        eyebrow="Patient Portal"
        title={`Welcome${user?.fname ? `, ${user.fname}` : ""}`}
        text="Book physician appointments, review scheduled radiology exams, confirm your visit, and access completed reports."
        image="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1600&q=80"
      />

      <Stats
        items={[
          { label: "Appointments", value: "Book", text: "Choose a physician from the database" },
          { label: "Scheduled Exams", value: "Confirm", text: "Accept or decline exam orders" },
          { label: "Reports", value: "View", text: "Check final radiology reports" },
        ]}
      />
    </>
  );
}
