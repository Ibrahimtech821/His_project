import Hero from "../../components/Hero";
import Stats from "../../components/Stats";

export default function RadiologistDashboard() {
  return (
    <>
      <Hero
        eyebrow="Radiologist Workspace"
        title="Reporting workspace for completed radiology exams"
        text="Create final reports with findings, impression, recommendations, report date, and status."
        image="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=80"
      />

      <Stats
        items={[
          { label: "Reports", value: "Create", text: "Write findings and impression" },
          { label: "Status", value: "Update", text: "Pending, completed, reviewed" },
          { label: "Archive", value: "View", text: "Completed report history" },
        ]}
      />
    </>
  );
}
