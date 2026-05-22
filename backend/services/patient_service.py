from extension import db
from models import Patient
from werkzeug.security import generate_password_hash


def register_patient(data):
    required = ["fname", "lname", "email", "password", "street", "state", "city", "sex"]

    for field in required:
        if field not in data or not data[field]:
            return {"error": f"{field} is required"}, 400

    existing_patient = Patient.query.filter_by(email=data["email"]).first()
    if existing_patient:
        return {"error": "Email already exists"}, 409

    patient = Patient(
        patient_number=data.get("patient_number"),
        ssn=data.get("ssn"),
        fname=data["fname"],
        lname=data["lname"],
        birthdate=data.get("birthdate"),
        street=data["street"],
        state=data["state"],
        city=data["city"],
        sex=data["sex"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"])
    )

    db.session.add(patient)
    db.session.commit()

    return {
        "message": "Patient registered successfully",
        "patient_id": patient.patient_id
    }, 201