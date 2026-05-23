import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auth
export const patientLogin = (data) => api.post("/auth/patient-login", data);
export const employeeLogin = (data) => api.post("/auth/employee-login", data);

// Patients
export const registerPatient = (data) => api.post("/patients/register", data);

// Employees
export const createEmployee = (data) => api.post("/employees/", data);
export const getEmployees = (employee_type = "") =>
  api.get(employee_type ? `/employees/?employee_type=${employee_type}` : "/employees/");

export const getPhysicians = () => getEmployees("physician");
export const getTechnicians = () => getEmployees("technician");
export const getRadiologists = () => getEmployees("radiologist");

// Appointments
export const createAppointment = (data) => api.post("/appointments/", data);
export const getAppointments = () => api.get("/appointments/");
export const updateAppointmentStatus = (appointment_id, appointment_status) =>
  api.put(`/appointments/${appointment_id}/status`, { appointment_status });

// Radiology
export const createScanRequest = (data) => api.post("/radiology/scan-requests", data);
export const getScanRequests = (status = "") =>
  api.get(status ? `/radiology/scan-requests?status=${status}` : "/radiology/scan-requests");

export const acceptScanRequest = (request_id, admin_id) =>
  api.put(`/radiology/scan-requests/${request_id}/accept`, { admin_id });

export const createExamOrder = (data) => api.post("/radiology/exam-orders", data);

export const getPatientExamOrders = (patient_id) =>
  api.get(`/radiology/patients/${patient_id}/exam-orders`);

export const getTechnicianExamOrders = (technician_id) =>
  api.get(`/radiology/technicians/${technician_id}/exam-orders`);

export const updateExamConfirmation = (exam_id, patient_confirmation_status) =>
  api.put(`/radiology/exam-orders/${exam_id}/confirmation`, { patient_confirmation_status });

export const uploadRadiologyImage = (data) => api.post("/radiology/images", data);
export const uploadRadiologyImageFile = (formData) =>
  api.post("/radiology/images/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const createRadiologyReport = (data) => api.post("/radiology/reports", data);
export const getReports = () => api.get("/radiology/reports");
export const getRooms = () => api.get("/radiology/rooms");

export const createRoom = (data) => api.post("/radiology/rooms", data);
export const createScanType = (data) => api.post("/radiology/scan-types", data);
export const getScanTypes = () => api.get("/radiology/scan-types");
export const getCompletedExams = (radiologist_id = "") =>
  api.get(
    radiologist_id
      ? `/radiology/exam-orders/completed?radiologist_id=${radiologist_id}`
      : "/radiology/exam-orders/completed"
  );
export default api;
