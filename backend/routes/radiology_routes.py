from flask import Blueprint, request
from services.radiology_service import create_scan_request, accept_scan_request,schedule_exam_order,update_patient_confirmation,upload_image,create_report


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
@radiology_bp.route("/reports", methods=["POST"])
def add_report():
    data = request.get_json()
    result, status_code = create_report(data)
    return result, status_code