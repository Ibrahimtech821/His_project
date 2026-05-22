from flask import Blueprint, request
from services.employee_service import create_employee_account,get_employees_by_type

employee_bp = Blueprint("employee", __name__, url_prefix="/api/employees")


@employee_bp.route("/", methods=["POST"])
def create_employee():
    data = request.get_json()
    result, status_code = create_employee_account(data)
    return result, status_code

@employee_bp.route("/", methods=["GET"])
def get_employees():
    employee_type = request.args.get("employee_type")
    result, status_code = get_employees_by_type(employee_type)
    return result, status_code