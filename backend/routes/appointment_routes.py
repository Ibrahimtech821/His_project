from flask import Blueprint, request
from services.appointment_service import create_appointment, get_all_appointments

appointment_bp = Blueprint("appointment", __name__, url_prefix="/api/appointments")


@appointment_bp.route("/", methods=["POST"])
def add_appointment():
    data = request.get_json()
    result, status_code = create_appointment(data)
    return result, status_code


@appointment_bp.route("/", methods=["GET"])
def list_appointments():
    result, status_code = get_all_appointments()
    return result, status_code