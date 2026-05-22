from extension import db
from models import ScanRequest,ExamOrder,Image,Report


def create_scan_request(data):
    required = ["appointment_id", "scan_type_id"]

    for field in required:
        if not data.get(field):
            return {"error": f"{field} is required"}, 400

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