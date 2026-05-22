from flask import Flask
from flask_cors import CORS

from config import Config
from extension import db

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

@app.route("/")
def home():
    return {"message": "Radiology HIS API Running"}

if __name__ == "__main__":
    app.run(debug=True)