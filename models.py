# models.py

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    entreprise = db.Column(db.String(150), nullable=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.entreprise}')"

class URL(db.Model):
    __bind_key__ = 'secondary'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2083), unique=True, nullable=False)