from extension import db
from models import Employee, Admin, Physician, Radiologist, Technician
from werkzeug.security import generate_password_hash


def create_employee_account(data):
    required = [
        "fname", "lname", "street", "state", "city",
        "specialization", "sex", "employee_type",
        "email", "password"
    ]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    employee_type = data["employee_type"]

    if employee_type not in ["admin", "physician", "radiologist", "technician"]:
        return {"error": "Invalid employee type"}, 400

    if Employee.query.filter_by(email=data["email"]).first():
        return {"error": "Email already exists"}, 409

    employee = Employee(
        fname=data["fname"],
        lname=data["lname"],
        birthdate=data.get("birthdate"),
        street=data["street"],
        state=data["state"],
        city=data["city"],
        specialization=data["specialization"],
        sex=data["sex"],
        employee_type=employee_type,
        email=data["email"],
        password_hash=generate_password_hash(data["password"])
    )

    db.session.add(employee)
    db.session.flush()

    if employee_type == "admin":
        db.session.add(Admin(admin_id=employee.employee_id))

    elif employee_type == "physician":
        db.session.add(Physician(
            employee_id=employee.employee_id,
            degree=data.get("degree"),
            medical_license_num=data.get("medical_license_num")
        ))

    elif employee_type == "radiologist":
        db.session.add(Radiologist(
            employee_id=employee.employee_id,
            degree=data.get("degree"),
            radiologist_license_num=data.get("radiologist_license_num")
        ))

    elif employee_type == "technician":
        db.session.add(Technician(
            employee_id=employee.employee_id,
            technical_certification=data.get("technical_certification"),
            experience_years=data.get("experience_years")
        ))

    db.session.commit()

    return {
        "message": f"{employee_type} account created successfully",
        "employee_id": employee.employee_id
    }, 201