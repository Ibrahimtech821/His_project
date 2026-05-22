from extension import db
from models import Appointment


def create_appointment(data):
    required = ["patient_id", "physician_id", "appointment_datetime"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    appointment = Appointment(
        patient_id=data["patient_id"],
        physician_id=data["physician_id"],
        appointment_datetime=data["appointment_datetime"],
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
        result.append({
            "appointment_id": a.appointment_id,
            "patient_id": a.patient_id,
            "physician_id": a.physician_id,
            "appointment_datetime": str(a.appointment_datetime),
            "appointment_status": a.appointment_status
        })

    return {
        "count": len(result),
        "appointments": result
    }, 200