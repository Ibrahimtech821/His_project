from flask import Blueprint, request
from services.employee_service import create_employee_account

employee_bp = Blueprint("employee", __name__, url_prefix="/api/employees")


@employee_bp.route("/", methods=["POST"])
def create_employee():
    data = request.get_json()
    result, status_code = create_employee_account(data)
    return result, status_code