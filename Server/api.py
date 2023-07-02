
from apibrain import ApiBrain

from dotenv import load_dotenv
import os

from flask import Flask, jsonify, request

from sqlalchemy import or_
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

from flask_cors import CORS, cross_origin
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user

from flask_jwt_extended import create_access_token, unset_jwt_cookies, jwt_required
from flask_jwt_extended import get_jwt, get_jwt_identity, JWTManager
from werkzeug.security import generate_password_hash, check_password_hash


import json
from datetime import datetime, timedelta, timezone

# Load variables from .env file
load_dotenv()

# Flask config
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
CORS(app)
jwt = JWTManager(app)

# Connect to db
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

brain = ApiBrain()


class User(UserMixin, db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    username = db.Column(db.String(250), nullable=False, unique=True)
    email = db.Column(db.String(250), nullable=False, unique=True)
    password_hash = db.Column(db.String(250), nullable=False)
    profile_img = db.Column(db.String(250), nullable=True)
    # posts = relationship("BlogPost", back_populates="author")
    # comments = relationship('Comment', back_populates='author')


class NumberOfSearches(db.Model):
    __tablename__ = 'Searches_done'
    id = db.Column(db.Integer, primary_key=True)
    searches = db.Column(db.Integer, nullable=False)
    # posts = relationship("BlogPost", back_populates="author")
    # comments = relationship('Comment', back_populates='author')


# Configure login manager
login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.login_message = 'Invalid. Please login in to access that page.'
login_manager.init_app(app)

# # Create tables on db
# with app.app_context():
#     db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, user_id)


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


@app.route("/register", methods=['POST'])
def register():
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')

    name = (last_name + ' ' + first_name).lower()
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    username_in_database = User.query.filter_by(username=username).first()
    if not username_in_database:
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        new_user = User(name=name, username=username.lower(), email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        response = {
            "message": "User created successfully"
        }
        return response, 201
    else:
        return {"message": "That user already exists."}, 409


@app.route("/login", methods=['POST'])
def handle_login():
    username = request.json.get('username')
    password = request.json.get("password")

    user = User.query.filter(or_(User.username == username, User.email == username)).first()

    if not user:
        return {"msg": "That user doesn't exists. Maybe you meant 'Register'? "}, 404
    else:
        if check_password_hash(pwhash=user.password_hash, password=password):
            access_token = create_access_token(identity=username)
            login_user(user, remember=True)

            response = {
                "id": user.id,
                "name": user.name.title(),
                "username": user.username.title(),
                "email": user.email,
                "access_token": access_token
            }
            return response


@app.route("/logout", methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"msg": "logout successful"})
    logout_user()
    unset_jwt_cookies(response)
    return response


@app.route('/profile', methods=['POST'])
@jwt_required()
def profile():
    user_role = request.json.get('id')
    print(user_role)
    if user_role == 1:
        response_body = {
            "urls": ["Nagatoro", "Momo", "Azunyan", "Kairi", "Hatsune Miku"]
        }
        return response_body
    else:
        return {"msg": "You don't have permission to see this"}, 401


@app.route("/api", methods=['GET'])
@cross_origin()
def api():
    url = request.args.get('url')
    data = brain.make_api_call(url)
    return data


if __name__ == '__main__':
    app.run(debug=True, port=8080)
