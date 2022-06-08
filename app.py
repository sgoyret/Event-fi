from flask import Flask, render_template, session, request, redirect, url_for, session, flash
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
from werkzeug.security import generate_password_hash


app = Flask(__name__)
mongoClient = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
eventifydb = mongoClient['EVdb']
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_MONGODB"] = mongoClient
app.config["SESSION_MONGODB_DB"] = "EVdb"
app.config["SESSION_MONGODB_COLLECT"] = "sessions"
Session(app)


@app.route('/index', strict_slashes=False)
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'], strict_slashes=False)
def register():
    "create user account"
    if request.method == 'POST':
            name = request.form.get('name')
            last_name = request.form.get('last_name')
            password = request.form.get('password')
            email = request.form.get('email')
            if name and last_name and password and email:
                hashed_password = generate_password_hash(password)
                collection = eventifydb['users']
                userdata = {'name': name, 'last_name': last_name, 'email': email, 'password': hashed_password}
                id = collection.insert_one(userdata)
                print(id)
            session["name"] = last_name
            return redirect(url_for('index'))
    return render_template('register.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)