# models.py

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    entreprise = db.Column(db.String(150), nullable=True)
    failed_attempts = db.Column(db.Integer, default=0)
    lock_until = db.Column(db.DateTime, nullable=True)
    def __repr__(self):
        return f"User('{self.username}', '{self.entreprise}')"
    def is_locked(self):
        if self.lock_until and self.lock_until > datetime.utcnow():
            return True
        return False
    
    def reset_failed_attempts(self):
        self.failed_attempts = 0
        self.lock_until = None
        db.session.commit()

class blackURL(db.Model):
    __bind_key__ = 'black-urls'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2083), unique=True, nullable=False)

class whiteURL(db.Model):
    __bind_key__ = 'white-urls'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2083), unique=True, nullable=False)

class Hash(db.Model):
    __bind_key__ = 'file'
    __tablename__ = 'hash'
    id = db.Column(db.Integer, primary_key=True)
    hash = db.Column(db.String(64), unique=True, nullable=False)