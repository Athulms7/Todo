from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=True)

    todos = db.relationship("Todo", backref="user", lazy=True)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    status = db.Column(db.String(50), nullable=False, default="PENDING")  # e.g., PENDING, DOING, COMPLETED
    priority = db.Column(db.String(20), nullable=False, default="MEDIUM")  # e.g., LOW, MEDIUM, HIGH

    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
