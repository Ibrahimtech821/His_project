from extension import db


class ScanType(db.Model):
    __tablename__ = "scan_type"

    scan_type_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    scan_name = db.Column(db.String(50), unique=True, nullable=False)
    modality = db.Column(db.String(30))
    description = db.Column(db.String(100))


class ScanRequest(db.Model):
    __tablename__ = "scan_request"

    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey("appointment.appointment_id"), nullable=False)
    scan_type_id = db.Column(db.Integer, db.ForeignKey("scan_type.scan_type_id"), nullable=False)
    request_date = db.Column(db.Date)
    reason = db.Column(db.String(100))
    notes = db.Column(db.String(100))
    request_status = db.Column(db.Enum("pending", "accepted"), default="pending")
    accepted_by_admin_id = db.Column(db.Integer, db.ForeignKey("admin.admin_id"), nullable=True)

    appointment = db.relationship("Appointment")
    scan_type = db.relationship("ScanType")
    accepted_by_admin = db.relationship("Admin")


class Room(db.Model):
    __tablename__ = "room"

    room_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    room_number = db.Column(db.String(20), unique=True, nullable=False)
    room_type = db.Column(db.String(30), nullable=False)
    status = db.Column(db.Enum("available", "busy", "maintenance"), default="available")


class ExamOrder(db.Model):
    __tablename__ = "exam_order"

    exam_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    request_id = db.Column(db.Integer, db.ForeignKey("scan_request.request_id"), unique=True, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("room.room_id"), nullable=False)
    technician_id = db.Column(db.Integer, db.ForeignKey("technician.employee_id"), nullable=False)
    radiologist_id = db.Column(db.Integer, db.ForeignKey("radiologist.employee_id"), nullable=False)
    scheduled_datetime = db.Column(db.DateTime, nullable=False)
    patient_confirmation_status = db.Column(
        db.Enum("pending", "confirmed", "declined"),
        default="pending"
    )
    status = db.Column(db.Enum("completed", "notcompleted"), default="notcompleted")
    scheduled_by_admin_id = db.Column(db.Integer, db.ForeignKey("admin.admin_id"), nullable=False)

    request = db.relationship("ScanRequest")
    room = db.relationship("Room")
    technician = db.relationship("Technician")
    radiologist = db.relationship("Radiologist")
    scheduled_by_admin = db.relationship("Admin")


class Image(db.Model):
    __tablename__ = "image"

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exam_id = db.Column(db.Integer, db.ForeignKey("exam_order.exam_id"), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.Date)

    exam = db.relationship("ExamOrder")


class Report(db.Model):
    __tablename__ = "report"

    report_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    exam_id = db.Column(db.Integer, db.ForeignKey("exam_order.exam_id"), unique=True, nullable=False)
    radiologist_id = db.Column(db.Integer, db.ForeignKey("radiologist.employee_id"), nullable=False)
    findings = db.Column(db.String(255))
    impression = db.Column(db.String(255))
    recommendation = db.Column(db.String(255))
    report_date = db.Column(db.Date)
    report_status = db.Column(db.String(30), default="notcompleted")

    exam = db.relationship("ExamOrder")
    radiologist = db.relationship("Radiologist")