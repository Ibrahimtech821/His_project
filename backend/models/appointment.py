from extension import db


class Appointment(db.Model):
    __tablename__ = "appointment"

    appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"), nullable=False)
    physician_id = db.Column(db.Integer, db.ForeignKey("physician.employee_id"), nullable=False)
    appointment_datetime = db.Column(db.DateTime, nullable=False)
    appointment_status = db.Column(
        db.Enum("pending", "scheduled", "completed", "cancelled"),
        default="pending"
    )

    patient = db.relationship("Patient")
    physician = db.relationship("Physician")