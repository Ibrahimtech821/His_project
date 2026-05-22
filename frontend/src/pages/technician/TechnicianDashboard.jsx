import Hero from "../../components/Hero";
import Stats from "../../components/Stats";

export default function TechnicianDashboard() {
  return (
    <>
      <Hero
        eyebrow="Technician Workspace"
        title="Assigned exams and scan image records"
        text="View your assigned radiology exams and save scan image records after the exam is performed."
        image="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1600&q=80"
      />

      <Stats
        items={[
          { label: "Assigned Exams", value: "View", text: "Exam orders assigned to you" },
          { label: "Image Record", value: "Upload", text: "Save image path and upload date" },
          { label: "Status", value: "Track", text: "Patient confirmation status" },
        ]}
      />
    </>
  );
}
