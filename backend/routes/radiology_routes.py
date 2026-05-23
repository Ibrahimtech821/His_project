from flask import Blueprint, request
from werkzeug.utils import secure_filename
from services.radiology_service import create_scan_request, accept_scan_request,schedule_exam_order,update_patient_confirmation,upload_image,create_report,get_scan_requests,get_patient_exam_orders,get_reports,get_technician_exam_orders,get_rooms,create_room,create_scan_type,get_scan_types,get_completed_exams


radiology_bp = Blueprint("radiology", __name__, url_prefix="/api/radiology")


@radiology_bp.route("/scan-requests", methods=["POST"])
def add_scan_request():
    data = request.get_json()
    result, status_code = create_scan_request(data)
    return result, status_code

@radiology_bp.route("/scan-requests/<int:request_id>/accept", methods=["PUT"])
def accept_request(request_id):
    data = request.get_json()
    admin_id = data.get("admin_id")

    result, status_code = accept_scan_request(request_id, admin_id)
    return result, status_code

@radiology_bp.route("/exam-orders", methods=["POST"])
def schedule_exam():
    data = request.get_json()
    result, status_code = schedule_exam_order(data)
    return result, status_code

@radiology_bp.route("/exam-orders/<int:exam_id>/confirmation", methods=["PUT"])
def confirm_exam(exam_id):
    data = request.get_json()
    result, status_code = update_patient_confirmation(exam_id, data)
    return result, status_code

@radiology_bp.route("/images", methods=["POST"])
def add_image():
    data = request.get_json()
    result, status_code = upload_image(data)
    return result, status_code


@radiology_bp.route("/images/upload", methods=["POST"])
def upload_image_file():
    # Accept multipart file uploads from technicians
    file = request.files.get("image")
    exam_id = request.form.get("exam_id")
    upload_date = request.form.get("upload_date")

    if not file or not exam_id:
        return {"error": "image file and exam_id are required"}, 400

    # Save file to a local uploads folder
    import os
    uploads_dir = os.path.join("static", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    safe_name = secure_filename(file.filename)
    filename = f"exam_{exam_id}_{safe_name}"
    filepath = os.path.join(uploads_dir, filename)
    file.save(filepath)

    # Store relative path in DB (varchar/string)
    image_path = f"/static/uploads/{filename}"

    result, status_code = upload_image({"exam_id": int(exam_id), "image_path": image_path, "upload_date": upload_date})
    return result, status_code
@radiology_bp.route("/reports", methods=["POST"])
def add_report():
    data = request.get_json()
    result, status_code = create_report(data)
    return result, status_code
@radiology_bp.route("/scan-requests", methods=["GET"])
def list_scan_requests():
    status = request.args.get("status")
    result, status_code = get_scan_requests(status)
    return result, status_code


@radiology_bp.route("/patients/<int:patient_id>/exam-orders", methods=["GET"])
def patient_exam_orders(patient_id):
    result, status_code = get_patient_exam_orders(patient_id)
    return result, status_code


@radiology_bp.route("/technicians/<int:technician_id>/exam-orders", methods=["GET"])
def technician_exam_orders(technician_id):
    result, status_code = get_technician_exam_orders(technician_id)
    return result, status_code


@radiology_bp.route("/reports", methods=["GET"])
def list_reports():
    result, status_code = get_reports()
    return result, status_code

@radiology_bp.route("/rooms", methods=["GET"])
def list_rooms():
    result, status_code = get_rooms()
    return result, status_code

@radiology_bp.route("/rooms", methods=["POST"])
def add_room():
    data = request.get_json()
    result, status_code = create_room(data)
    return result, status_code

@radiology_bp.route("/scan-types", methods=["POST"])
def add_scan_type():
    data = request.get_json()
    result, status_code = create_scan_type(data)
    return result, status_code


@radiology_bp.route("/exam-orders/completed", methods=["GET"])
def list_completed_exams():
    result, status_code = get_completed_exams()
    return result, status_code


@radiology_bp.route("/scan-types", methods=["GET"])
def list_scan_types():
    result, status_code = get_scan_types()
    return result, status_code