from app import app
from extension import db
from models import Employee, Admin
from werkzeug.security import generate_password_hash

with app.app_context():
    existing = Employee.query.filter_by(email="admin@his.com").first()

    if existing:
        print("Admin already exists")
    else:
        admin = Employee(
            fname="System",
            lname="Admin",
            street="Main Street",
            state="Cairo",
            city="Cairo",
            specialization="Administration",
            sex="male",
            employee_type="admin",
            email="admin@his.com",
            password_hash=generate_password_hash("admin123")
        )

        db.session.add(admin)
        db.session.flush()

        db.session.add(Admin(admin_id=admin.employee_id))
        db.session.commit()

        print("Admin created successfully")
        print("Email: admin@his.com")
        print("Password: admin123")