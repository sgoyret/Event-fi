from flask import Flask, render_template, session, request, redirect, url_for, session, flash
from flask_cors import CORS
from flask_session import Session
from flask_pymongo import PyMongo
from validations import *
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
Session(app)

@app.route('/index', strict_slashes=False)
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'], strict_slashes=False)
def register():
    "create user account"
    print("******************register route******************")
    if request.method == 'POST':
            print("checking the request json")
            if validate_user_creation(request.json):
                print('the dictionary is valid')
                request.json['password'] = generate_password_hash(request.json['password'])
                collection= mongo.db.users
                id = collection.insert_one(request.json)
                session["name"] = request.json['username']
            return redirect(url_for('index'))
    if request.method == 'GET':
        return render_template('register.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)