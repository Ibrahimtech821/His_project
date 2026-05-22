# RadixCare Radiology HIS React Frontend

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Backend

The frontend connects to:

```txt
http://127.0.0.1:5000/api
```

Configured in:

```txt
src/services/api.js
```

## Backend endpoints expected

Authentication:
- POST /auth/patient-login
- POST /auth/employee-login

Patients:
- POST /patients/register

Employees:
- POST /employees/
- GET /employees/?employee_type=physician
- GET /employees/?employee_type=technician
- GET /employees/?employee_type=radiologist

Appointments:
- POST /appointments/
- GET /appointments/

Radiology:
- POST /radiology/scan-requests
- GET /radiology/scan-requests
- GET /radiology/scan-requests?status=pending
- GET /radiology/scan-requests?status=accepted
- PUT /radiology/scan-requests/:request_id/accept
- POST /radiology/exam-orders
- GET /radiology/patients/:patient_id/exam-orders
- GET /radiology/technicians/:technician_id/exam-orders
- PUT /radiology/exam-orders/:exam_id/confirmation
- POST /radiology/images
- POST /radiology/reports
- GET /radiology/reports

## First admin

Use your backend seed admin:

```txt
admin@his.com
admin123
```

Login as Employee. The backend decides the role from `employee_type`.
