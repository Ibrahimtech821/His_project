import Hero from "../../components/Hero";
import Stats from "../../components/Stats";
import { useAuth } from "../../context/AuthContext";

export default function PhysicianDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Hero
        eyebrow="Physician Workspace"
        title={`Welcome Dr. ${user?.lname || user?.fname || ""}`}
        text="Review patient appointments and create accurate scan requests with reason and notes."
        image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80"
      />

      <Stats
        items={[
          { label: "Appointments", value: "Review", text: "View patient appointments" },
          { label: "Scan Request", value: "Create", text: "Select appointment and scan type" },
          { label: "Notes", value: "Add", text: "Reason and clinical notes" },
        ]}
      />
    </>
  );
}
