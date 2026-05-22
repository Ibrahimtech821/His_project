from extension import db
from models import ScanRequest,ExamOrder,Image,Report,Appointment,Employee,Room,ScanType


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

    existing_exam = ExamOrder.query.filter_by(
        request_id=data["request_id"]
    ).first()

    if existing_exam:
        return {"error": "This scan request already has an exam order"}, 409

    exam_order = ExamOrder(
        request_id=data["request_id"],
        room_id=data["room_id"],
        technician_id=data["technician_id"],
        scheduled_datetime=data["scheduled_datetime"],
        scheduled_by_admin_id=data["scheduled_by_admin_id"],
        patient_confirmation_status="pending"
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

    existing_report = Report.query.filter_by(
        exam_id=data["exam_id"]
    ).first()

    if existing_report:
        return {"error": "This exam already has a report"}, 409

    report = Report(
        exam_id=data["exam_id"],
        radiologist_id=data["radiologist_id"],
        findings=data.get("findings"),
        impression=data.get("impression"),
        recommendation=data.get("recommendation"),
        report_date=data.get("report_date"),
        report_status=data.get("report_status", "completed")
    )

    db.session.add(report)
    db.session.commit()

    return {
        "message": "Report created successfully",
        "report_id": report.report_id
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
    # Exams that have at least one uploaded image and do not yet have a report
    exams = (
        db.session.query(ExamOrder)
        .join(Image, ExamOrder.exam_id == Image.exam_id)
        .outerjoin(Report, ExamOrder.exam_id == Report.exam_id)
        .filter(Report.exam_id == None)
        .all()
    )

    result = []
    for e in exams:
        images = Image.query.filter_by(exam_id=e.exam_id).all()
        image_paths = [img.image_path for img in images]
        tech = Employee.query.get(e.technician_id)
        result.append({
            "exam_id": e.exam_id,
            "request_id": e.request_id,
            "room_id": e.room_id,
            "technician_id": f"{tech.fname} {tech.lname}" if tech else e.technician_id,
            "scheduled_datetime": str(e.scheduled_datetime),
            "patient_confirmation_status": e.patient_confirmation_status,
            "images": image_paths,
        })

    return result, 200