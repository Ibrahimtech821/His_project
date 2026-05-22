from extension import db


class Employee(db.Model):
    __tablename__ = "employee"

    employee_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=False)
    birthdate = db.Column(db.Date)
    street = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    specialization = db.Column(db.String(30), nullable=False)
    sex = db.Column(db.Enum("male", "female"), nullable=False)
    employee_type = db.Column(db.Enum("admin", "physician", "radiologist", "technician"), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)


class Admin(db.Model):
    __tablename__ = "admin"

    admin_id = db.Column(db.Integer, db.ForeignKey("employee.employee_id"), primary_key=True)
    employee = db.relationship("Employee")


class Physician(db.Model):
    __tablename__ = "physician"

    employee_id = db.Column(db.Integer, db.ForeignKey("employee.employee_id"), primary_key=True)
    degree = db.Column(db.String(50))
    medical_license_num = db.Column(db.String(50), unique=True)

    employee = db.relationship("Employee")


class Radiologist(db.Model):
    __tablename__ = "radiologist"

    employee_id = db.Column(db.Integer, db.ForeignKey("employee.employee_id"), primary_key=True)
    degree = db.Column(db.String(50))
    radiologist_license_num = db.Column(db.String(50), unique=True)

    employee = db.relationship("Employee")


class Technician(db.Model):
    __tablename__ = "technician"

    employee_id = db.Column(db.Integer, db.ForeignKey("employee.employee_id"), primary_key=True)
    technical_certification = db.Column(db.String(100))
    experience_years = db.Column(db.Integer)

    employee = db.relationship("Employee")