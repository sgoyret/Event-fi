from bson.objectid import ObjectId
from flask import Flask, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
from functions.refresh import *
from functions.validations import *
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)

mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = 'super secret key'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route('/', strict_slashes=False)
@app.route('/index', methods=['GET'], strict_slashes=False)
def index():
    """user base page"""
    # checks if session exists
    if session.get('user'):
        print(f'user: {session}')
        return render_template('index.html')
    print('session user doesnt exist')
    return redirect(url_for('login'))

@app.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    """log in for the user with register option"""
    if request.method == 'GET':
        if session.get('user') is None:
            return render_template('login.html')
        else:
            return redirect(url_for('index'))

    if request.method == 'POST':
        for key, value in request.form.items():
            print(f'{key}: {value}')
        new_data = {}
        for item in request.form:
            new_data[item] = request.form[item]
        
        
        print(new_data)
        user = mongo.users.find_one({'username': new_data['username']})
        if user:
            if check_password_hash(user['password'], new_data['password']): #hashed passord against plain password
                print('the password checked')
                user.pop('password')
                session['user'] = user
                session['test'] = 'am i here?'
                print(session['user'])
                return redirect('/')
            else:
                return 'Wrong password'
        else:
            return 'User not found'

@app.route('/logout', strict_slashes=False)
def logout():
    if session.get('user'):
        session.pop('user')
    return redirect(url_for('index'))

@app.route('/register', methods=['POST', 'GET'], strict_slashes=False)
def register():
    """create user account"""
    print("******************register route******************")
    if request.method == 'POST':
        if validate_user_creation(request.form):
             
            print('the dictionary is valid')
            new_data = {}
            for item in request.form:
                new_data[item] = request.form[item]
            if mongo.users.find_one({'username': new_data['username']}) is None:
                new_data['password'] = generate_password_hash(new_data['password'])
                print(new_data)
                collection= mongo.users
                id = collection.insert_one(new_data)
                new_data.pop('password')
                session['user'] = new_data
                print(f'the session[user] is: {session["user"]}')
                return redirect(url_for('index'))
            else:
                print('El nombre de usuario ya esta creado')
                print(new_data['username'])
                print(mongo.users.find_one({'username': new_data['username']}))
                
        return redirect(url_for('register'))
    if request.method == 'GET':
        return render_template('register.html')

@app.route('/user', methods=['GET'], strict_slashes=False)
def user():
    print(session)
    return render_template('user.html', username= '@' + session['user']['username'],
                            names=session['user']['name'] + ' ' + session['user']['last_name'])


# *********************** HOLA API **********************


# ---------USER ROUTES----------


@app.route('/api/users', methods=['GET'], strict_slashes=False)
def users():
    """get all users"""
    if session['user']:
        print(f'there is a session {session["user"]}')
    users = mongo.get_collection('users').find()
    if users:
        user_list = []
        for item in users:
            item['_id'] = str(item.get('_id'))
            user_list.append(item)
        return jsonify(user_list)
    else:
        return "no users found"
    
@app.route('/api/users/<user_id>', strict_slashes=False, methods=['GET'])
def get_user(user_id):
    """returns user with matching id else error"""
    if session['user']:
        print(f'there is a session {session["user"]}')
    user = mongo.get_collection('users').find_one({'_id': ObjectId(user_id)})
    if user:
        user['_id'] = str(user.get('_id'))
        return jsonify(user)
    else:
        return "user not found"
    
    
# ---------event ROUTES----------


@app.route('/api/events', strict_slashes=False, methods=['GET', 'POST'])
def events():
    """Returns all the events from the current logged user"""
    if session.get('user') is None:
       return redirect(url_for('index'))
    
    if request.method == 'GET':
        # returns events list
        session['user']['events'] = {'id1': {'avatar':'', 'title':'Graduation', 'location':'Holberton School', 'date': '20/06/2022'},
                                     'id2': {'avatar':'', 'title':'First job', 'location':'A very good company', 'date': '01/07/2022'}}
        user_events = session.get('user').get('events')
        if user_events:
            print("events from current logged user")
            print(user_events)
            #user_events = json.loads(user_events)
        return jsonify(user_events)
    
    if request.method == 'POST':
        #create new event
        if validate_event_creation(request.form):
            print('the event dict is valid')
            new_event_data = request.form
            new_event_data['owner'] = session.get('user').get('_id') # set owner
            new_event_data['members'] = [{session.get('user').get('_id'): {"name": session.get('user').get('username'), "type": "admin"}}] # set owner as member with type admin
            obj = mongo.events.insert_one(new_event_data)
            # update user events in session
            session['user']['events'][obj.inserted_id] =  {
                {'name': new_event_data['name'],
                 'type': 'admin'}
                }
            mongo.users.update_one({'_id': session.get('user').get('_id')}, {'$set': {'events': session.get('user').get('events')}}) # update user events in db
            
            return redirect(url_for('events'))

@app.route('/api/events/<event_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_event(event_id):
    """route for single event, get for event info, put for event member delete, post for event members insert"""
    if request.method == 'GET':
        # return event json object
        event = mongo.events.find_one({'_id': ObjectId(event_id)})
        if event:
            event['_id'] = str(event.get('_id'))
            return jsonify(event)
        else:
            return "event not found"
        
    if request.method == 'POST':
        # add member to event
        event = mongo.events.find_one({'_id': ObjectId(event_id)})
        if event:
            new_user_event_data = {}
            new_user_event_data[ObjectId(request.form.get('id'))] = {'name': request.form.get('name')}
            mongo.events.update_one({'_id': ObjectId(event_id)}, {'$push': {'members': new_user_event_data}}) # push member to member list
            mongo.events.update_one({'_id': new_user_event_data['id']}, {'$push': {'events': ObjectId(event_id)}}) # push event to user events'   
            return "user added to event"
        else:
            return "event not found"
    
    if request.method == 'PUT':
        # delete member from event
        event = mongo.events.find_one({'_id': ObjectId(event_id)})
        if event:
            if mongo.events.update_one({'_id': ObjectId(event_id)},
                                          { '$pull': { event_id: {'members': {'_id': ObjectId(request.form.get('id'))}}}},false,true):
                return "user removed from event"
            else:
                return "user not found"
        else:
            return "event not found"

    if request.method == 'DELETE':
        # delete event
        if mongo.events.delete_one({'_id': ObjectId(event_id)}):
            return "event deleted"
        else:
            return "event not found"


# ---------GROUP ROUTES----------


@app.route('/api/groups', strict_slashes=False, methods=['GET', 'POST'])
def groups():
    """Returns all the groups from the current logged user"""
    if session.get('user') is None:
       return redirect(url_for('index'))

    if request.method == 'GET':
        # returns groups list
        user_groups = session.get('user').get('groups')
        if user_groups:
            print("groups from current logged user")
            print(user_groups)
            user_groups = json.loads(user_groups)
        return jsonify(user_groups)

    if request.method == 'POST':
        #create new group
        if validate_group_creation(request.form):
            print('the group dict is valid')
            new_group_data = request.form
            new_group_data['owner'] = session.get('user').get('_id') # set owner
            new_group_data['members'] = [{session.get('user').get('_id'): {"name": session.get('user').get('username'), "type": "admin"}}] # set owner as member with type admin
            obj = mongo.groups.insert_one(new_group_data)
            # update user groups in session
            session['user']['groups'][obj.inserted_id] =  {
                {'name': new_group_data['name'],
                 'type': 'admin'}
                }
            mongo.users.update_one({'_id': session.get('user').get('_id')}, {'$set': {'groups': session.get('user').get('groups')}}) # update user groups in db

            return redirect(url_for('groups'))

@app.route('/api/groups/<group_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_group(group_id):
    """route for single group, get for group info, put for group member delete, post for group members insert"""
    if request.method == 'GET':
        # return group json object
        group = mongo.groups.find_one({'_id': ObjectId(group_id)})
        if group:
            group['_id'] = str(group.get('_id'))
            return jsonify(group)
        else:
            return "group not found"

    if request.method == 'POST':
        # add member to group
        group = mongo.groups.find_one({'_id': ObjectId(group_id)})
        if group:
            new_user_group_data = {}
            new_user_group_data[ObjectId(request.form.get('id'))] = {'name': request.form.get('name')}
            mongo.groups.update_one({'_id': ObjectId(group_id)}, {'$push': {'members': new_user_group_data}}) # push member to member list
            mongo.groups.update_one({'_id': new_user_group_data['id']}, {'$push': {'groups': ObjectId(group_id)}}) # push group to user groups'   
            session_refresh() # refresh session
            return "user added to group"
        else:
            return "group not found"

    if request.method == 'PUT':
        # delete member from group
        group = mongo.groups.find_one({'_id': ObjectId(group_id)})
        if group:
            if mongo.groups.update_one({'_id': ObjectId(group_id)}, { '$pull': { group_id: {'members': {'_id': ObjectId(request.form.get('id'))}}}},False,True): # si puedo deletear el miembro del grupo dsp borro la id del grupo de la lista de grupos del usuario
                mongo.users.update_one({'_id': ObjectId(request.form.get('id'))},
                                       {'$pull': {'groups': {'_id': ObjectId(group_id)}}},False,True)
                session_refresh()
                return "user removed from group"
            else:
                return "user not found"
        else:
            return "group not found"

    if request.method == 'DELETE':
        # delete group
        if mongo.groups.delete_one({'_id': ObjectId(group_id)}):
            mongo.users.update_many({'groups': {'_id': ObjectId(group_id)}}, {'$pull': {'groups': {'_id': ObjectId(group_id)}}},False,True) # find all users with this group and remove it from their groups
            session_refresh()
            return "group deleted"
        else:
            return "group not found"

if __name__ == '__main__':
    app.run(port=5001, debug=True)