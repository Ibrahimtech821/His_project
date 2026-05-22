from flask import Flask
from flask_cors import CORS

from config import Config
from extension import db
from models import *
from routes.patient_routes import patient_bp
from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.appointment_routes import appointment_bp
from routes.radiology_routes import radiology_bp

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)
app.register_blueprint(patient_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(appointment_bp)
app.register_blueprint(radiology_bp)

@app.route("/")
def home():
    return {"message": "Radiology HIS API Running"}

if __name__ == "__main__":
    app.run(debug=True)