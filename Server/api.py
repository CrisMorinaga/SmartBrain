from dotenv import load_dotenv
from apibrain import ApiBrain
import os

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json
from datetime import datetime, timedelta, timezone

# Load variables from .env file
load_dotenv()

# Flask config
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
CORS(app)
jwt = JWTManager(app)

brain = ApiBrain()


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


@app.route("/login", methods=['POST'])
def create_login_token():
    name = request.json.get('username', None)
    password = request.json.get("password", None)
    if name != "test" or password != '12345678':
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=name)
    response = {
        "id": 1,
        "name": name,
        "access_token": access_token
    }
    return response


@app.route("/logout", methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route('/profile', methods=['POST'])
@jwt_required()
def my_profile():
    user_role = request.json.get('id')
    if user_role == 1:
        response_body = {
            "name": "Nagato",
            "about": "Hello! I'm a full stack developer that loves python and javascript"
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
