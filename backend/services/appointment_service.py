from extension import db
from datetime import datetime
from models import Appointment, Patient, Employee


def _parse_datetime(value):
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            # Supports values like 2026-05-23T14:30 from datetime-local input.
            return datetime.fromisoformat(value)
        except ValueError:
            return None
    return None


def create_appointment(data):
    required = ["patient_id", "physician_id", "appointment_datetime"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    appointment_datetime = _parse_datetime(data["appointment_datetime"])
    if not appointment_datetime:
        return {"error": "Invalid appointment_datetime format"}, 400

    physician_conflict = Appointment.query.filter(
        Appointment.physician_id == data["physician_id"],
        Appointment.appointment_datetime == appointment_datetime,
        Appointment.appointment_status.in_(["pending", "scheduled"]),
    ).first()

    if physician_conflict:
        return {"error": "This doctor already has an appointment at the same time"}, 409

    patient_conflict = Appointment.query.filter(
        Appointment.patient_id == data["patient_id"],
        Appointment.appointment_datetime == appointment_datetime,
        Appointment.appointment_status.in_(["pending", "scheduled"]),
    ).first()

    if patient_conflict:
        return {"error": "Patient already has an appointment at the same time"}, 409

    appointment = Appointment(
        patient_id=data["patient_id"],
        physician_id=data["physician_id"],
        appointment_datetime=appointment_datetime,
        appointment_status=data.get("appointment_status", "pending")
    )

    db.session.add(appointment)
    db.session.commit()

    return {
        "message": "Appointment created successfully",
        "appointment_id": appointment.appointment_id
    }, 201


def get_all_appointments():
    appointments = Appointment.query.all()

    result = []
    for a in appointments:
        patient = Patient.query.get(a.patient_id)
        physician = Employee.query.get(a.physician_id)
        result.append({
            "appointment_id": a.appointment_id,
            "patient_id": a.patient_id,
            "patient_name": f"{patient.fname} {patient.lname}" if patient else None,
            "physician_id": a.physician_id,
            "physician_name": f"Dr. {physician.fname} {physician.lname}" if physician else None,
            "appointment_datetime": str(a.appointment_datetime),
            "appointment_status": a.appointment_status
        })

    return {
        "count": len(result),
        "appointments": result
    }, 200


def update_appointment_status(appointment_id, data):
    status = data.get("appointment_status")

    if status not in ["scheduled", "cancelled"]:
        return {"error": "appointment_status must be scheduled or cancelled"}, 400

    appointment = Appointment.query.get(appointment_id)

    if not appointment:
        return {"error": "Appointment not found"}, 404

    if appointment.appointment_status != "pending":
        return {"error": "Appointment has already been decided"}, 400

    if status == "scheduled":
        existing_scheduled = Appointment.query.filter(
            Appointment.physician_id == appointment.physician_id,
            Appointment.appointment_datetime == appointment.appointment_datetime,
            Appointment.appointment_status == "scheduled",
            Appointment.appointment_id != appointment.appointment_id,
        ).first()

        if existing_scheduled:
            appointment.appointment_status = "cancelled"
            db.session.commit()
            return {
                "message": "This time slot is already taken. Appointment was rejected automatically.",
                "appointment_id": appointment.appointment_id,
                "appointment_status": appointment.appointment_status,
            }, 200

    appointment.appointment_status = status
    db.session.commit()

    return {
        "message": "Appointment status updated successfully",
        "appointment_id": appointment.appointment_id,
        "appointment_status": appointment.appointment_status,
    }, 200