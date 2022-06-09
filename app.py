from flask import Flask, render_template, session, request, redirect, url_for, session, flash
from flask_cors import CORS
from flask_session import Session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash


app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost/events_db'
mongo = PyMongo(app)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = 'super secret key'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_MONGODB"] = mongo.db
app.config["SESSION_MONGODB_DB"] = "events_db"
app.config["SESSION_MONGODB_COLLECT"] = "sessions"
ses = Session(app)

@app.route('/index', strict_slashes=False)
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'], strict_slashes=False)
def register():
    "create user account"
    if request.method == 'POST':
            name = request.json.get('name')
            last_name = request.json.get('last_name')
            password = request.json.get('password')
            email = request.json.get('email')
            if name and last_name and password and email:
                hashed_password = generate_password_hash(password)
                id = mongo.db.users.insert_one(
                    {'name': name, 'last_name': last_name, 'email': email, 'password': hashed_password}
                )
            session["name"] = last_name
            return redirect(url_for('index'))
    return render_template('register.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)