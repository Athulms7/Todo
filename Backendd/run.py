from flask import Flask, redirect, url_for, jsonify, request
from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
from datetime import timedelta
from models import db, User
from app.todos import create_todo_blueprint
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY")

# Flask config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = app.secret_key
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)

# Mail config
app.config['MAIL_SERVER'] = "smtp.gmail.com"
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('SEND_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

# CORS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Extensions
mail = Mail(app)
db.init_app(app)
jwt = JWTManager(app)

# Register Blueprint with mail
app.register_blueprint(create_todo_blueprint(mail), url_prefix="/api")

# Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    client_kwargs={'scope': 'email profile'},
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)

@app.route('/')
def home():
    return " Flask Backend Running", 200

@app.route('/login')
def login():
    google_client = oauth.create_client('google')
    redirect_uri = url_for('authorize', _external=True)
    return google_client.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    google_client = oauth.create_client('google')
    token = google_client.authorize_access_token()
    user_info = google_client.get('userinfo').json()

    # Save or fetch user
    user = User.query.filter_by(email=user_info['email']).first()
    if not user:
        user = User(name=user_info.get("name"), email=user_info["email"])
        db.session.add(user)
        db.session.commit()

    # Create JWT
    jwt_token = create_access_token(identity=user.email, additional_claims={
        "id": user.id,
        "name": user.name
    },expires_delta=timedelta(hours=10))

    # Redirect to frontend with token
    return redirect(f"http://localhost:5173/dashboard?token={jwt_token}")

@app.route('/api/user')
@jwt_required()
def get_user():
    identity = get_jwt_identity()
    user = User.query.filter_by(email=identity).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'name': user.name, 'email': user.email})

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)



