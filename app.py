from distutils.log import error
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

@app.route('/', methods=['GET'], strict_slashes=False)
def landing():
    """returns landing page"""
    return render_template('landing.html')

@app.route('/index', methods=['GET'], strict_slashes=False)
def index():
    """user base page"""
    # checks if session exists
    if session.get('user'):
        # print(session.get('user'))
        session_refresh()
        if session.get('user').get('events'):
            for e in session.get('user').get('events'):
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', e.get('event_id')), 'r') as file:
                        print("going to read file")
                        e['avatar'] = file.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user'), 'r') as file:
                        print("going to read file")
                        e['avatar'] = file.read()
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
                return redirect(url_for('index'))
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
        avatar = request.form.get('avatar_content')
        if avatar is None:
            return {'error': 'no avatar data'}
        if validate_image(avatar) is False:
            return {'error': 'image is not supported'}
        check_response = validate_user(request.form, to_validate)
        if check_response is True:             
            print('the dictionary is valid')
            new_data = {}
            for item in request.form:
                if item == 'avatar_content' or item == 'avatar':
                    continue
                else:
                    new_data[item] = request.form[item]
            new_data['username'] = new_data['username'].lower()
            if mongo.users.find_one({'username': new_data['username']}) is None:
                new_data['password'] = generate_password_hash(new_data['password'])
                new_data['type'] = 'user'
                new_data['notifications'] = []
                new_data['notifications'].append('Welcome to Event-fi App, Click our Icon to learn more about us!')
                obj = mongo.users.insert_one(new_data)
                new_data.pop('password')
                new_data['_id'] = str(obj.inserted_id)
                

                filename = new_data['_id']
            
                # print(f'avatar name: {avatar.name} final filename: {filename}\nUPLOAD_FOLDER: {UPLOAD_FOLDER}')
                # print(avatar.split(','))
                # image_data = base64.b64decode(avatar.split(',')[1].encode())
                with open(os.path.join(UPLOAD_FOLDER, 'avatars', new_data['_id']), 'w+') as file:
                    print("going to wrtie file")
                    file.write(avatar)
                new_data['avatar'] = f'/static/avatars/{new_data["_id"]}'
                mongo.users.update_one({'_id': ObjectId(new_data['_id'])}, {'$set': {'avatar': new_data['avatar']}})
                
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
    try:
        with open(os.path.join(UPLOAD_FOLDER, 'avatars', session.get('user').get('_id'))) as avt:
            print('pude abrir el avatar')
            session['user']['avatar'] = avt.read()
        if session.get('user').get('contacts'):
            contacts_with_avatar = []
            for idx, c in enumerate(session.get('user').get('contacts')):
                contacts_with_avatar.append(c)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', c.get('user_id'))) as avt:
                        print('pude abrir el avatar')
                        contacts_with_avatar[idx]['avatar'] = avt.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                        print('pude abrir el avatar')
                        contacts_with_avatar[idx]['avatar'] = avt.read()
            session['user']['contacts'] = contacts_with_avatar
    except Exception as ex:
        print(ex)
    try:
        if session.get('user').get('groups'):
            groups_with_avatar = []
            for idx, g in enumerate(session.get('user').get('groups')):
                groups_with_avatar.append(g)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', g.get('group_id'))) as avt:
                        print('pude abrir el avatar')
                        groups_with_avatar[idx]['avatar'] = avt.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                        print('pude abrir el avatar')
                        groups_with_avatar[idx]['avatar'] = avt.read()
            session['user']['groups'] = groups_with_avatar
    except Exception as ex:
        raise(ex)
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
        mongo.users.update_one({'_id': ObjectId(session['user']['_id'])}, {'$set': update_data})
        session_refresh()
        return redirect(url_for('user'))

@app.route('/map', strict_slashes=False, methods=['GET'])
def map():
    location_query = mongo.locations.find()
    locations = []
    for l in location_query:
        if l.get('_id'):
            l['location_id'] = str(l['_id'])
            l.pop('_id')
        try:
            print(f'yendo a abrir: {l.get("name")}')
            with open(os.path.join(UPLOAD_FOLDER, l['avatar'])) as avt:
                print('pude abrir el avatar de la location')
                l['avatar'] = avt.read()
                print(f'now the avatar is {l.get("avatar")}')
        except Exception as ex:
            print(ex)
        locations.append(l)

    return render_template('map.html', locations=locations, event=[], user=session.get('user'))

@app.route('/map/event/<event_id>', strict_slashes=False, methods=['GET'])
def map_event(event_id):
    if session.get('user') is None:
        return redirect(url_for('login'))
    session_refresh()
    event = mongo.events.find_one({'_id': ObjectId(event_id)})
    if event:
        return render_template('map.html', locations=[],  event=event, user=session.get('user'))
    else:
        return {"error": "event not found"}


if __name__ == '__main__':
    app.run(port=5001, debug=True)