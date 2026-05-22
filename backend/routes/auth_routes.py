from flask import Blueprint, request
from services.auth_service import patient_login, employee_login

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/patient-login", methods=["POST"])
def patient_login_route():
    data = request.get_json()
    result, status_code = patient_login(data)
    return result, status_code


@auth_bp.route("/employee-login", methods=["POST"])
def employee_login_route():
    data = request.get_json()
    result, status_code = employee_login(data)
    return result, status_code