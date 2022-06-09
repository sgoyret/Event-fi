from flask import Flask, render_template, session, request, redirect, url_for, session, flash
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
from validations import *
from werkzeug.security import generate_password_hash


app = Flask(__name__)
app.secret_key = 'my little secret key'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/eventify'
mongo = MongoClient('localhost', 27017)
db = mongo.eventify

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

#app.config["SESSION_PERMANENT"] = False
#app.config["SESSION_TYPE"] = "mongodb"
#app.config["SESSION_MONGODB"] = mongo
#app.config["SESSION_MONGODB_DB"] = "eventify"
#app.config["SESSION_MONGODB_COLLECT"] = "sessions"
#Session(app)


@app.route('/index', strict_slashes=False)
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'], strict_slashes=False)
def register():
    "create user account"
    print("******************register route******************")
    if request.method == 'POST':
            print(request.json)
            username = request.json.get('username')
            name = request.json.get('name')
            last_name = request.json.get('last_name')
            password = request.json.get('password')
            email = request.json.get('email')

            print("checking the request json")
            if validate_user_creation(request.json):
                print('the dictionary is valid')
                hashed_password = generate_password_hash(password)
                collection = db.users
                userdata = {'name': name, 'last_name': last_name, 'email': email, 'password': hashed_password}

                id = collection.insert_one(userdata)
                print(id)
            else:
                print("i didnt try to put the user into mongo")
            session["name"] = last_name
            return redirect(url_for('index'))
    if request.method == 'GET':
        return render_template('register.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)