from models import Patient, Employee
from werkzeug.security import check_password_hash


def patient_login(data):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password are required"}, 400

    patient = Patient.query.filter_by(email=email).first()

    if not patient:
        return {"error": "Invalid email or password"}, 401

    if not check_password_hash(patient.password_hash, password):
        return {"error": "Invalid email or password"}, 401

    return {
        "message": "Patient login successful",
        "user_type": "patient",
        "patient": {
            "patient_id": patient.patient_id,
            "fname": patient.fname,
            "lname": patient.lname,
            "email": patient.email
        }
    }, 200


def employee_login(data):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password are required"}, 400

    employee = Employee.query.filter_by(email=email).first()

    if not employee:
        return {"error": "Invalid email or password"}, 401

    if not check_password_hash(employee.password_hash, password):
        return {"error": "Invalid email or password"}, 401

    return {
        "message": "Employee login successful",
        "user_type": employee.employee_type,
        "employee": {
            "employee_id": employee.employee_id,
            "fname": employee.fname,
            "lname": employee.lname,
            "email": employee.email,
            "employee_type": employee.employee_type
        }
    }, 200