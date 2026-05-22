class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:whysoserious?@localhost:3306/radiology_project"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False