


# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from flask_mail import Message
# from models import db, Todo, User
# import os

# def create_todo_blueprint(mail):
#     todo_bp = Blueprint("todo", __name__)

#     @todo_bp.route("/todos", methods=["GET"])
#     @jwt_required()
#     def get_todos():
#         email = get_jwt_identity()
#         user = User.query.filter_by(email=email).first()
#         todos = Todo.query.filter_by(user_id=user.id).all()
#         return jsonify([{"id": t.id, "text": t.text, "completed": t.completed} for t in todos])

#     @todo_bp.route("/todos", methods=["POST"])
#     @jwt_required()
#     def create_todo():
#         data = request.get_json()
#         email = get_jwt_identity()
#         user = User.query.filter_by(email=email).first()

#         new_todo = Todo(text=data["text"], user_id=user.id)
#         db.session.add(new_todo)
#         db.session.commit()

#         # ✅ Send Email on Todo Creation
#         msg = Message(
#             subject="Todo Created",
#             sender=os.getenv("SEND_EMAIL"),
#             recipients=[user.email]
#         )
#         msg.body = f"Hello {user.name}, your todo '{new_todo.text}' has been created!"
#         mail.send(msg)

#         return jsonify({"message": "Todo created"}), 201

#     return todo_bp


from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from models import db, Todo, User
import os
from datetime import datetime

def create_todo_blueprint(mail):
    todo_bp = Blueprint("todo", __name__)

    @todo_bp.route("/todos", methods=["GET"])
    @jwt_required()
    def get_todos():
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        todos = Todo.query.filter_by(user_id=user.id).all()

        return jsonify([
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "status": t.status,
                "priority": t.priority,
                "dueDate": t.due_date.isoformat() if t.due_date else None,
                "createdAt": t.created_at.isoformat()
            } for t in todos
        ])

    @todo_bp.route("/todos", methods=["POST"])
    @jwt_required()
    def create_todo():
        data = request.get_json()
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()

        due_date = None
        if "dueDate" in data and data["dueDate"]:
            try:
                due_date = datetime.fromisoformat(data["dueDate"].replace("Z", "+00:00"))
            except Exception:
                return jsonify({"error": "Invalid dueDate format"}),400

        new_todo = Todo(
            title=data.get("title", "Untitled"),
            description=data.get("description", ""),
            status=data.get("status", "PENDING"),
            priority=data.get("priority", "MEDIUM"),
            due_date=due_date,
            user_id=user.id
        )

        db.session.add(new_todo)
        db.session.commit()

        msg = Message(
            subject="New Todo Created",
            sender=os.getenv("SEND_EMAIL"),
            recipients=[user.email]
        )
        msg.body = (
            f"Hello {user.name or user.email},\n\n"
            f"You've created a new todo:\n"
            f"Title: {new_todo.title}\n"
            f"Description: {new_todo.description or 'N/A'}\n"
            f"Status: {new_todo.status}\n"
            f"Priority: {new_todo.priority}\n"
            f"Due Date: {new_todo.due_date.strftime('%Y-%m-%d %H:%M:%S') if new_todo.due_date else 'None'}\n\n"
            "Thank you!"
        )
        mail.send(msg)

        return jsonify({
            "message": "Todo created",
            "todo": {
                "id": new_todo.id,
                "title": new_todo.title,
                "description": new_todo.description,
                "status": new_todo.status,
                "priority": new_todo.priority,
                "dueDate": new_todo.due_date.isoformat() if new_todo.due_date else None,
                "createdAt": new_todo.created_at.isoformat()
            }
        }), 201
        
    @todo_bp.route("/todos/<int:id>", methods=["PUT"])
    @jwt_required()
    def update_todo(id):
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        todo = Todo.query.filter_by(id=id, user_id=user.id).first()

        if not todo:
            return jsonify({"error": "Todo not found"}), 404

        data = request.get_json()
        todo.title = data.get("title", todo.title)
        todo.description = data.get("description", todo.description)
        todo.status = data.get("status", todo.status)
        todo.priority = data.get("priority", todo.priority)

        due_date = data.get("dueDate")
        if due_date:
            try:
                todo.due_date = datetime.fromisoformat(due_date.replace("Z", "+00:00"))
            except ValueError:
                return jsonify({"error": "Invalid dueDate format"}), 400

        db.session.commit()

        return jsonify({
            "message": "Successfully updated todo",
            "todo": {
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "status": todo.status,
                "priority": todo.priority,
                "dueDate": todo.due_date.isoformat() if todo.due_date else None
            }
        }), 200

    @todo_bp.route("/todos/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_todo(id):
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        todo = Todo.query.filter_by(id=id, user_id=user.id).first()

        if not todo:
            return jsonify({"error": "Todo not found"}), 404

        db.session.delete(todo)
        db.session.commit()

        return jsonify({"message": "Successfully deleted todo"}), 204

    return todo_bp    
