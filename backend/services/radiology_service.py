from flask import request
from extension import db
from datetime import datetime
from models import ScanRequest,ExamOrder,Image,Report,Appointment,Employee,Room,ScanType,Radiologist
from sqlalchemy import or_

BACKEND_ORIGIN = "http://127.0.0.1:5000"


def _normalize_report_status(raw_status):
    if raw_status in ["completed", "notcompleted", "not completed"]:
        return "notcompleted" if raw_status == "not completed" else raw_status
    return None


def _parse_datetime(value):
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value)
        except ValueError:
            return None
    return None


def create_scan_request(data):
    required = ["appointment_id", "scan_type_id"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    appointment = Appointment.query.get(data["appointment_id"])

    if not appointment:
        return {"error": "Appointment not found"}, 404

    if appointment.appointment_status != "scheduled":
        return {"error": "Scan request can only be created for accepted appointments"}, 400

    existing_request = ScanRequest.query.filter_by(appointment_id=data["appointment_id"]).first()
    if existing_request:
        return {"error": "A scan request already exists for this appointment"}, 409

    scan_request = ScanRequest(
        appointment_id=data["appointment_id"],
        scan_type_id=data["scan_type_id"],
        request_date=data.get("request_date"),
        reason=data.get("reason"),
        notes=data.get("notes"),
        request_status="pending"
    )

    db.session.add(scan_request)
    db.session.commit()

    return {
        "message": "Scan request created successfully",
        "request_id": scan_request.request_id
    }, 201



def accept_scan_request(request_id, admin_id):
    if not admin_id:
        return {"error": "admin_id is required"}, 400

    scan_request = ScanRequest.query.get(request_id)

    if not scan_request:
        return {"error": "Scan request not found"}, 404
    
    if scan_request.request_status == "accepted":
        return {"error": "Request already accepted"}, 400
    scan_request.request_status = "accepted"
    scan_request.accepted_by_admin_id = admin_id

    db.session.commit()

    return {
        "message": "Scan request accepted successfully",
        "request_id": scan_request.request_id,
        "accepted_by_admin_id": scan_request.accepted_by_admin_id
    }, 200




def schedule_exam_order(data):
    required = [
        "request_id",
        "room_id",
        "technician_id",
        "radiologist_id",
        "scheduled_datetime",
        "scheduled_by_admin_id"
    ]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    scan_request = ScanRequest.query.get(data["request_id"])

    if not scan_request:
        return {"error": "Scan request not found"}, 404

    if scan_request.request_status != "accepted":
        return {"error": "Scan request must be accepted before scheduling"}, 400

    scheduled_datetime = _parse_datetime(data["scheduled_datetime"])
    if not scheduled_datetime:
        return {"error": "Invalid scheduled_datetime format"}, 400

    existing_exam = ExamOrder.query.filter_by(
        request_id=data["request_id"]
    ).first()

    if existing_exam:
        return {"error": "This scan request already has an exam order"}, 409

    assigned_radiologist = Radiologist.query.get(data["radiologist_id"])
    if not assigned_radiologist:
        return {"error": "Radiologist not found"}, 404

    time_conflict = ExamOrder.query.filter_by(
        scheduled_datetime=scheduled_datetime,
        room_id=data["room_id"],
        technician_id=data["technician_id"]
    ).first()

    if time_conflict:
        return {"error": "This room or technician is already booked at the selected time"}, 409

    exam_order = ExamOrder(
        request_id=data["request_id"],
        room_id=data["room_id"],
        technician_id=data["technician_id"],
        radiologist_id=data["radiologist_id"],
        scheduled_datetime=scheduled_datetime,
        scheduled_by_admin_id=data["scheduled_by_admin_id"],
        patient_confirmation_status="pending",
        status="notcompleted"
    )

    db.session.add(exam_order)
    db.session.commit()

    return {
        "message": "Exam order scheduled successfully",
        "exam_id": exam_order.exam_id
    }, 201




def update_patient_confirmation(exam_id, data):
    status = data.get("patient_confirmation_status")

    if status not in ["confirmed", "declined"]:
        return {"error": "Status must be confirmed or declined"}, 400

    exam_order = ExamOrder.query.get(exam_id)

    if not exam_order:
        return {"error": "Exam order not found"}, 404

    exam_order.patient_confirmation_status = status
    db.session.commit()

    return {
        "message": "Patient confirmation updated successfully",
        "exam_id": exam_order.exam_id,
        "patient_confirmation_status": exam_order.patient_confirmation_status
    }, 200




def upload_image(data):
    required = ["exam_id", "image_path"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    exam_order = ExamOrder.query.get(data["exam_id"])

    if not exam_order:
        return {"error": "Exam order not found"}, 404

    if exam_order.patient_confirmation_status != "confirmed":
        return {"error": "Image upload is only allowed after the exam is confirmed"}, 400

    image = Image(
        exam_id=data["exam_id"],
        image_path=data["image_path"],
        upload_date=data.get("upload_date")
    )

    db.session.add(image)

    db.session.commit()

    return {
        "message": "Image uploaded successfully",
        "image_id": image.image_id
    }, 201




def create_report(data):
    required = ["exam_id", "radiologist_id"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    requested_status = _normalize_report_status(data.get("report_status", "completed"))
    if not requested_status:
        return {"error": "report_status must be completed or notcompleted"}, 400

    exam_order = ExamOrder.query.get(data["exam_id"])
    if not exam_order:
        return {"error": "Exam order not found"}, 404

    radiologist_id = data.get("radiologist_id")
    if str(radiologist_id) != str(exam_order.radiologist_id):
        return {"error": "This exam is assigned to a different radiologist"}, 403

    existing_report = Report.query.filter_by(exam_id=data["exam_id"]).first()
    report_id = None
    action_message = "Report created successfully"

    if existing_report:
        # Allow updating a draft/not-completed report to completed.
        if existing_report.report_status in ["notcompleted", "not completed"]:
            existing_report.radiologist_id = exam_order.radiologist_id
            existing_report.findings = data.get("findings")
            existing_report.impression = data.get("impression")
            existing_report.recommendation = data.get("recommendation")
            existing_report.report_date = data.get("report_date")
            existing_report.report_status = requested_status
            report_id = existing_report.report_id
            action_message = "Report updated successfully"
        else:
            return {"error": "This exam already has a completed report"}, 409
    else:
        report = Report(
            exam_id=data["exam_id"],
            radiologist_id=exam_order.radiologist_id,
            findings=data.get("findings"),
            impression=data.get("impression"),
            recommendation=data.get("recommendation"),
            report_date=data.get("report_date"),
            report_status=requested_status
        )
        db.session.add(report)
        db.session.flush()
        report_id = report.report_id

    if exam_order and requested_status == "completed":
        exam_order.status = "completed"

    db.session.commit()

    return {
        "message": action_message,
        "report_id": report_id
    }, 201




def get_scan_requests(status=None):
    query = ScanRequest.query

    if status:
        query = query.filter_by(request_status=status)

    requests = query.all()

    result = []

    for r in requests:
        result.append({
            "request_id": r.request_id,
            "appointment_id": r.appointment_id,
            "scan_type_id": r.scan_type_id,
            "request_date": str(r.request_date),
            "reason": r.reason,
            "notes": r.notes,
            "request_status": r.request_status,
            "accepted_by_admin_id": r.accepted_by_admin_id
        })

    return result, 200


def get_patient_exam_orders(patient_id):
    exams = (
        db.session.query(ExamOrder)
        .join(ScanRequest, ExamOrder.request_id == ScanRequest.request_id)
        .join(Appointment, ScanRequest.appointment_id == Appointment.appointment_id)
        .filter(Appointment.patient_id == patient_id)
        .all()
    )

    result = []

    for e in exams:
        tech = Employee.query.get(e.technician_id)
        result.append({
            "exam_id": e.exam_id,
            "request_id": e.request_id,
            "room_id": e.room_id,
            "technician_id": f"{tech.fname} {tech.lname}" if tech else None,
            "scheduled_datetime": str(e.scheduled_datetime),
            "scheduled_by_admin_id": e.scheduled_by_admin_id,
            "patient_confirmation_status": e.patient_confirmation_status
        })

    return result, 200


def get_technician_exam_orders(technician_id):
    exams = ExamOrder.query.filter_by(technician_id=technician_id).all()

    result = []

    for e in exams:
        result.append({
            "exam_id": e.exam_id,
            "request_id": e.request_id,
            "room_id": e.room_id,
            "technician_id": e.technician_id,
            "scheduled_datetime": str(e.scheduled_datetime),
            "patient_confirmation_status": e.patient_confirmation_status
        })

    return result, 200


def get_reports():
    reports = Report.query.all()

    result = []

    for r in reports:
        result.append({
            "report_id": r.report_id,
            "exam_id": r.exam_id,
            "radiologist_id": r.radiologist_id,
            "findings": r.findings,
            "impression": r.impression,
            "recommendation": r.recommendation,
            "report_date": str(r.report_date),
            "report_status": r.report_status
        })

    return result, 200

def get_rooms():
    rooms = Room.query.filter_by(status="available").all()

    result = []

    for room in rooms:
        result.append({
            "room_id": room.room_id,
            "room_number": room.room_number,
            "room_type": room.room_type
        })

    return result, 200

def create_room(data):
    required = ["room_number", "room_type", "status"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    existing_room = Room.query.filter_by(room_number=data["room_number"]).first()

    if existing_room:
        return {"error": "Room number already exists"}, 409

    room = Room(
        room_number=data["room_number"],
        room_type=data["room_type"],
        status=data["status"]
    )

    db.session.add(room)
    db.session.commit()

    return {
        "message": "Room created successfully",
        "room_id": room.room_id
    }, 201


def create_scan_type(data):
    required = ["scan_name"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

    existing_scan_type = ScanType.query.filter_by(
        scan_name=data["scan_name"]
    ).first()

    if existing_scan_type:
        return {"error": "Scan type already exists"}, 409

    scan_type = ScanType(
        scan_name=data["scan_name"],
        modality=data.get("modality"),
        description=data.get("description")
    )

    db.session.add(scan_type)
    db.session.commit()

    return {
        "message": "Scan type created successfully",
        "scan_type_id": scan_type.scan_type_id
    }, 201


def get_scan_types():
    scan_types = ScanType.query.all()

    result = []

    for scan in scan_types:
        result.append({
            "scan_type_id": scan.scan_type_id,
            "scan_name": scan.scan_name,
            "modality": scan.modality,
            "description": scan.description
        })

    return result, 200


def get_completed_exams():
    # Exams ready for radiologist: status is notcompleted and they have uploaded images.
    radiologist_id = request.args.get("radiologist_id", type=int)

    query = (
        db.session.query(ExamOrder)
        .join(Image, ExamOrder.exam_id == Image.exam_id)
        .outerjoin(Report, ExamOrder.exam_id == Report.exam_id)
    )

    query = query.filter(ExamOrder.status == "notcompleted")

    if radiologist_id:
        query = query.filter(ExamOrder.radiologist_id == radiologist_id)

    exams = query.filter(
        or_(
            Report.exam_id == None,
            Report.report_status.in_(["notcompleted", "not completed"])
        )
    ).distinct().all()

    result = []
    for e in exams:
        images = Image.query.filter_by(exam_id=e.exam_id).all()
        image_paths = [img.image_path for img in images]
        image_urls = [path if path.startswith("http") else f"{BACKEND_ORIGIN}{path}" for path in image_paths]
        tech = Employee.query.get(e.technician_id)
        assigned_radiologist = Employee.query.get(e.radiologist_id)
        result.append({
            "exam_id": e.exam_id,
            "request_id": e.request_id,
            "room_id": e.room_id,
            "technician_id": f"{tech.fname} {tech.lname}" if tech else e.technician_id,
            "radiologist_id": e.radiologist_id,
            "radiologist_name": f"{assigned_radiologist.fname} {assigned_radiologist.lname}" if assigned_radiologist else e.radiologist_id,
            "scheduled_datetime": str(e.scheduled_datetime),
            "patient_confirmation_status": e.patient_confirmation_status,
            "images": image_paths,
            "image_urls": image_urls,
        })

    return result, 200