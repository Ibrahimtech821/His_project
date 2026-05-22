import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientExams from "./pages/patient/PatientExams";
import PatientReports from "./pages/patient/PatientReports";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import EmployeeCreation from "./pages/admin/EmployeeCreation";
import AdminScanRequests from "./pages/admin/AdminScanRequests";
import ExamScheduling from "./pages/admin/ExamScheduling";

import PhysicianDashboard from "./pages/physician/PhysicianDashboard";
import PhysicianAppointments from "./pages/physician/PhysicianAppointments";
import CreateScanRequest from "./pages/physician/CreateScanRequest";

import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianExams from "./pages/technician/TechnicianExams";
import ImageUpload from "./pages/technician/ImageUpload";

import RadiologistDashboard from "./pages/radiologist/RadiologistDashboard";
import CreateReport from "./pages/radiologist/CreateReport";
import CompletedReports from "./pages/radiologist/CompletedReports";

import AdminRooms from "./pages/admin/AdminRooms";
import AdminScanTypes from "./pages/admin/AdminScanTypes";

import "./style.css";

const roleHome = {
  patient: "/patient/dashboard",
  admin: "/admin/dashboard",
  physician: "/physician/dashboard",
  technician: "/technician/dashboard",
  radiologist: "/radiologist/dashboard",
};

function ProtectedLayout({ allowed }) {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (!allowed.includes(role)) return <Navigate to={roleHome[role] || "/"} replace />;

  return <AppLayout />;
}

function PublicOnly({ children }) {
  const { user, role } = useAuth();
  if (user) return <Navigate to={roleHome[role] || "/"} replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

        <Route element={<ProtectedLayout allowed={["patient"]} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/exams" element={<PatientExams />} />
          <Route path="/patient/reports" element={<PatientReports />} />
        </Route>

        <Route element={<ProtectedLayout allowed={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/employees" element={<EmployeeCreation />} />
          <Route path="/admin/scan-requests" element={<AdminScanRequests />} />
          <Route path="/admin/schedule-exam" element={<ExamScheduling />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/scan-types" element={<AdminScanTypes />} />
        </Route>

        <Route element={<ProtectedLayout allowed={["physician"]} />}>
          <Route path="/physician/dashboard" element={<PhysicianDashboard />} />
          <Route path="/physician/appointments" element={<PhysicianAppointments />} />
          <Route path="/physician/scan-request" element={<CreateScanRequest />} />
        </Route>

        <Route element={<ProtectedLayout allowed={["technician"]} />}>
          <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
          <Route path="/technician/exams" element={<TechnicianExams />} />
          <Route path="/technician/images" element={<ImageUpload />} />
        </Route>

        <Route element={<ProtectedLayout allowed={["radiologist"]} />}>
          <Route path="/radiologist/dashboard" element={<RadiologistDashboard />} />
          <Route path="/radiologist/reports" element={<CreateReport />} />
          <Route path="/radiologist/completed" element={<CompletedReports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
