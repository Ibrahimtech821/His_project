import { createContext, useContext, useMemo, useState } from "react";
import { employeeLogin, patientLogin } from "../services/api";

const AuthContext = createContext(null);

function normalizePatient(responseData) {
  const patient = responseData?.patient || responseData || {};
  return {
    id: patient.patient_id,
    patient_id: patient.patient_id,
    fname: patient.fname,
    lname: patient.lname,
    email: patient.email,
    role: "patient",
  };
}

function normalizeEmployee(responseData) {
  const employee = responseData?.employee || responseData || {};
  return {
    id: employee.employee_id,
    employee_id: employee.employee_id,
    fname: employee.fname,
    lname: employee.lname,
    email: employee.email,
    role: employee.employee_type || responseData?.user_type || "admin",
    employee_type: employee.employee_type || responseData?.user_type || "admin",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("his_user");
    return saved ? JSON.parse(saved) : null;
  });

  const role = user?.role || "";

  const login = async (accountType, form) => {
    const response =
      accountType === "patient"
        ? await patientLogin(form)
        : await employeeLogin(form);

    const normalized =
      accountType === "patient"
        ? normalizePatient(response.data)
        : normalizeEmployee(response.data);

    localStorage.setItem("his_user", JSON.stringify(normalized));
    setUser(normalized);

    return normalized;
  };

  const logout = () => {
    localStorage.removeItem("his_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, role, login, logout }), [user, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
