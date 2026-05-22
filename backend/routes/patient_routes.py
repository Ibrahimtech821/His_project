from flask import Blueprint, request
from services.patient_service import register_patient

patient_bp = Blueprint("patient", __name__, url_prefix="/api/patients")


@patient_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    result, status_code = register_patient(data)
    return result, status_code