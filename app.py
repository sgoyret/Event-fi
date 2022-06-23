'''from distutils.log import error'''
from bson.objectid import ObjectId
from flask import Flask, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
from functions.validations import *
from api.views import api_views
from api.views import session_refresh
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import json
import os

app = Flask(__name__)
app.register_blueprint(api_views)

mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = 'super secret key'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', strict_slashes=False)
@app.route('/index', methods=['GET'], strict_slashes=False)
def index():
    """user base page"""
    # checks if session exists
    if session.get('user'):
        print(session.get('user'))
        session_refresh()
        return render_template('index.html', user=session.get('user'))
    return redirect(url_for('login'))

@app.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    """log in for the user with register option"""
    if request.method == 'GET':
        if session.get('user'):
            return redirect(url_for('index'))
        return render_template('login.html')

    if request.method == 'POST':
        to_validate= ['username', 'password']
        check_response = validate_user(request.form, to_validate)

        for key, value in request.form.items():
            print(f'{key}: {value}')
        new_data = {}
        for item in request.form:
            new_data[item] = request.form[item]

        user = mongo.users.find_one({'username': new_data['username']})
        if user:
            if check_password_hash(user['password'], new_data['password']): #hashed passord against plain password
                print('the password checked')
                user.pop('password')
                session['user'] = user
                session['test'] = 'am i here?'
                return redirect('/')
            else:
                return {'error': 'wrong password'}
        else:
            return {'error': 'user does not exist'}

@app.route('/logout', strict_slashes=False)
def logout():
    if session.get('user'):
        session.pop('user')
    return redirect(url_for('index'))

@app.route('/register', methods=['POST', 'GET'], strict_slashes=False)
def register():
    """create user account"""
    if session.get('user'):
        return redirect(url_for('index'))

    if request.method == 'POST':
        to_validate= ['username', 'name', 'last_name', 'email', 'password']
        if 'avatar' not in request.files:
            return {'error': 'no avatar'}
        avatar = request.files.get('avatar')
        print(f'and the avatar is: {avatar}')
        if avatar is None:
            return {'error': 'no avatar data'}
        if validate_image(avatar) is False:
            return {'error': 'image is not supported'}
        check_response = validate_user(request.form, to_validate)
        if check_response is True:             
            print('the dictionary is valid')
            new_data = {}
            for item in request.form:
                new_data[item] = request.form[item]
            new_data['username'] = new_data['username'].lower()
            if mongo.users.find_one({'username': new_data['username']}) is None:
                new_data['password'] = generate_password_hash(new_data['password'])
                new_data['type'] = 'user'
                obj = mongo.users.insert_one(new_data)
                new_data.pop('password')
                new_data['_id'] = str(obj.inserted_id)
                
                print(dir(avatar))
                filename = new_data['_id']
            
                print(f'avatar name: {avatar.name} final filename: {filename}\nUPLOAD_FOLDER: {UPLOAD_FOLDER}')
                avatar.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                mongo.users.update_one({'_id': ObjectId(new_data['_id'])}, {'$set': {'avatar': f'/static/{filename}'}})
                new_data['avatar'] = f'/static/avatars/{filename}'
                session['user'] = new_data


                return redirect(url_for('index'))
            else:
                flash('the username is already in use', error)
                return redirect(url_for('register'))
        flash(f'{check_response}', error)
        return redirect(url_for('register'))

    if request.method == 'GET':
        return render_template('register.html')

@app.route('/user', methods=['GET'], strict_slashes=False)
def user():
    if session.get('user') is None:
        return redirect(url_for('login'))
    session_refresh()
    return render_template('user.html', user=session['user'])

@app.route('/user/settings', methods=['GET', 'POST'], strict_slashes=False)
def settings():
    """user settings any info of user"""
    if  session.get('user') is None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        # render settings template passing session for Info
        return render_template('settings.html', user=session['user'])
    if request.method == 'POST':
        # update user info
        update_data = {}
        for item in request.form:
            if session['user'][item] == request.form[item]:
                continue
            update_data[item] = request.form[item]
        if len(update_data) == 0:
            return redirect(url_for('user'))
        if update_data.get('password'):
            update_data['password'] = generate_password_hash(update_data['password'])
        else:
            update_data.pop('password')
        print(f'data for update is : {update_data}')
        mongo.users.update_one({'_id': ObjectId(session['user']['_id'])}, {'$set': update_data})
        session_refresh()
        return redirect(url_for('user'))

if __name__ == '__main__':
    app.run(port=5001, debug=True)