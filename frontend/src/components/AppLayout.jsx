import {
  Activity,
  CalendarDays,
  ClipboardList,
  FileText,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  UserPlus,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHome = {
  patient: "/patient/dashboard",
  admin: "/admin/dashboard",
  physician: "/physician/dashboard",
  technician: "/technician/dashboard",
  radiologist: "/radiologist/dashboard",
};

const menus = {
  patient: [
    { to: "/patient/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/patient/appointments", label: "Appointments", icon: CalendarDays },
    { to: "/patient/exams", label: "Scheduled Exams", icon: ClipboardList },
    { to: "/patient/reports", label: "Reports", icon: FileText },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
    { to: "/admin/employees", label: "Employees", icon: UserPlus },
    { to: "/admin/scan-requests", label: "Scan Requests", icon: ClipboardList },
    { to: "/admin/schedule-exam", label: "Schedule Exam", icon: CalendarDays },
    { to: "/admin/rooms", label: "Rooms" },
    { to: "/admin/scan-types", label: "Scan Types" },
  ],
  physician: [
    { to: "/physician/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/physician/appointments", label: "Appointments", icon: Users },
    { to: "/physician/scan-request", label: "Scan Request", icon: ClipboardList },
  ],
  technician: [
    { to: "/technician/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/technician/exams", label: "Assigned Exams", icon: Activity },
    { to: "/technician/images", label: "Upload Image", icon: ImagePlus },
  ],
  radiologist: [
    { to: "/radiologist/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/radiologist/reports", label: "Create Report", icon: FileText },
    { to: "/radiologist/completed", label: "Completed Reports", icon: ClipboardList },
  ],
};

export default function AppLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = menus[role] || [];

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate(roleHome[role] || "/")}>
          <div className="brand-mark">R</div>
          <div>
            <h2>RadixCare</h2>
            <p>Radiology HIS</p>
          </div>
        </button>

        <nav className="side-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to}>
                {Icon ? <Icon size={19} /> : null}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="profile-box">
          <span>{role}</span>
          <strong>{user?.fname ? `${user.fname} ${user.lname || ""}` : user?.email}</strong>
          <button onClick={signOut}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p>{role?.toUpperCase()} WORKSPACE</p>
            <h1>Hospital Radiology Information System</h1>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
