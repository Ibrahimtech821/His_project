from extension import db


class Patient(db.Model):
    __tablename__ = "patient"

    patient_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_number = db.Column(db.String(30), unique=True)
    ssn = db.Column(db.String(20), unique=True)
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=False)
    birthdate = db.Column(db.Date)
    street = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    sex = db.Column(db.Enum("male", "female"), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)


class PatientPhone(db.Model):
    __tablename__ = "patient_phone"

    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"), primary_key=True)
    phone = db.Column(db.String(12), primary_key=True)

    patient = db.relationship("Patient")


class MedicalHistory(db.Model):
    __tablename__ = "medical_history"

    history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"), nullable=False)
    condition_name = db.Column(db.String(50))
    description = db.Column(db.String(100))
    diagnosis_date = db.Column(db.Date)

    patient = db.relationship("Patient")