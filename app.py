from bson.objectid import ObjectId
from flask import Flask, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
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

# Auxiliary functions
def session_refresh():
    user_id = session['user']['_id']
    session['user'] = None
    session['user'] = mongo.users.find_one({'_id': ObjectId(user_id)})

@app.route('/', strict_slashes=False)
@app.route('/index', methods=['GET'], strict_slashes=False)
def index():
    """user base page"""
    # checks if session exists
    if session.get('user'):
        return render_template('index.html')
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
        
        
        user = mongo.users.find_one({'username': new_data['username']})
        if user:
            if check_password_hash(user['password'], new_data['password']): #hashed passord against plain password
                print('the password checked')
                user.pop('password')
                session['user'] = user
                session['test'] = 'am i here?'
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
    if request.method == 'POST':
        check_response = validate_user_creation(request.form)
        if check_response is True:             
            print('the dictionary is valid')
            new_data = {}
            for item in request.form:
                new_data[item] = request.form[item]
            if mongo.users.find_one({'username': new_data['username']}) is None:
                new_data['password'] = generate_password_hash(new_data['password'])
                collection= mongo.users
                id = collection.insert_one(new_data)
                new_data.pop('password')
                session['user'] = new_data
                return redirect(url_for('index'))
            else:
                return {'error': 'the username iis already in use'}
                
        return redirect(url_for('register'))
    if request.method == 'GET':
        return render_template('register.html')

@app.route('/user', methods=['GET'], strict_slashes=False)
def user():
    if session.get('user') is None:
        return redirect(url_for('login'))
    session_refresh()
    print(f'user groups {session.get("user").get("groups")}')
    return render_template('user.html', user=session['user'])


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
        # session['user']['events'] = {'id1': {'avatar':'', 'title':'Graduation', 'location':'Holberton School', 'date': '20/06/2022'},
        #                              'id2': {'avatar':'', 'title':'First job', 'location':'A very good company', 'date': '01/07/2022'}}
        user_events = session.get('user').get('events')
        if user_events:
            print("events from current logged user")
            print(user_events)
            #user_events = json.loads(user_events)
            return jsonify(user_events)
        else:
            return 'no current events'
    
    if request.method == 'POST':
        #create new event
        if validate_event_creation(request.form):
            print('the event dict is valid')
            new_event_data = {}
            for item in request.form:
                new_event_data[item] = request.form[item]
    
            new_event_data['owner'] = str(session.get('user').get('_id')) # set owner
            owner_admin = {
                '_id': new_event_data['owner'],
                'username': session.get('user').get('username'),
                'name': session.get('user').get('name'),
                'last_name': session.get('user').get('last_name'),
                'type': 'admin'
            }
            new_event_data['members'] = []
            new_event_data['members'].append(owner_admin) # set owner as member with type admin
            obj = mongo.events.insert_one(new_event_data)
            
            # update user events in session
            if session.get('user').get('events') is None:
                session['user']['events'] = []
            session['user']['events'].append({
                '_id': str(obj.inserted_id),
                'name': new_event_data['name'],
                'date': new_event_data['date'],
                'type': 'admin'
                })
            mongo.users.update_one({'_id': session.get('user').get('_id')}, {'$set': {'events': session.get('user').get('events')}}) # update user events in db
            
            return redirect(url_for('events'))

@app.route('/api/events/<event_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_event(event_id):
    """route for single event, get for event info, put for event member delete, post for event members insert"""
    if not session.get('user'):
        return redirect(url_for('login'))
    if request.method == 'GET':
        # return event json object
        event = mongo.events.find_one({'_id': ObjectId(event_id)})
        if event:
            event['_id'] = str(event.get('_id'))
            return jsonify(event)
        else:
            return {'error': 'event not found'}
        
    if request.method == 'DELETE':
        # delete event
        event = mongo.events.find_one({'_id': ObjectId(event_id)})
        id_list = []
        for item in event['members']:
            id_list.append(ObjectId(item))
        if event:
            for item in id_list:
                mongo.users.update_one({'_id': item},
                                       {'$pull': {'events': {'name': event['name']}}},False,True) # remove event from user events
            mongo.events.delete_one({'_id': ObjectId(event_id)})
            
            # update session
            user_events = mongo.users.find_one({'_id': session.get('user').get('_id')})['events']
            session['user']['events'] = user_events
            return "event deleted"
        else:
            return {'error': 'event not found' }
        
        

@app.route('/api/events/<event_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def event_members(event_id):
    """route for event member managment"""
    event = mongo.events.find_one({'_id': ObjectId(event_id)})
    if event is None:
        return {'error': 'event does not exist'}

    if request.method == 'POST':
        # add member to event
        user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
        if user is None:
            return {'error': 'user does not exist'}

        new_user_event_data = {}
        for item in request.form:
            new_user_event_data[item] = request.form.get(item)
        new_user_event_data['name'] = user.get('name')
        new_user_event_data['last_name'] = user.get('last_name')
        new_user_event_data['username'] = user.get('username')
        print('adding user to event')
        mongo.events.update_one({'_id': event['_id']}, {'$push': {'members': new_user_event_data}}, upsert=True) # push member to member list
        print('added user to event')
        event_for_user = {}
        event_for_user['_id'] = event_id
        event_for_user['name'] = event.get('name')
        event_for_user['date'] = event.get('date')
        # event_for_user['start_date'] = event.get('start_date')
        # event_for_user['end_date'] = event.get('end_date')
        if new_user_event_data['type'] == 'admin':
            event_for_user['type'] = 'admin'
        mongo.users.update_one({'_id': user['_id']}, {'$push': {'events': event_for_user}}) # push event to user events'
        return "user added to event"

    if request.method == 'PUT':
        user = mongo.users.find_one({'_id': ObjectId(request.get_json['user_id'])})
        if user is None:
            return {'error': 'user does not exist'}

        new_type = request.json_get().get('type')        
        if not user.get('events').get('type') and new_type:
            user['events']['type'] = new_type
        elif user.get('events').get('type') and new_type:
            user['events']['type'] = new_type
        elif user.get('events').get('type') and new_type is None:
            user['events'].pop('type')

    if request.method == 'DELETE':
        # delete member from event
        user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
        if user is None:
            return {'error': 'user does not exist'}

        user_at = {}
        event_at_user = {}
        for idx, item in enumerate(event.get('members')):
            if item.get('user_id') == request.form.get('user_id'):
                user_at = event.get('members')[idx]
        for idx, item in enumerate(user.get('events')):
            if item.get('_id') == event_id:
                event_at_user = user.get('events')[idx]

        print(f'user to delete: {user_at}')
        if mongo.events.update_one({'_id': event['_id']},
                                   { '$pull': {'members': user_at}},False,True):
            mongo.users.update_one({'_id': ObjectId(request.form.get('user_id'))},
                                   {'$pull': {'events': event_at_user}},False,True) # remove event from user events
            if user.get('events') and len(user.get('events')) == 0:
                user.pop('events')
            return "user removed from event"
        else:
            return {'error': 'user not found'}
            


# ---------GROUP ROUTES----------


@app.route('/api/groups', strict_slashes=False, methods=['GET', 'POST', 'DELETE'])
def groups():
    """Returns all the groups from the current logged user"""
    if session.get('user') is None:
       return redirect(url_for('index'))

    if request.method == 'GET':
        # returns groups list
        user_groups = session.get('user').get('groups')
        if user_groups:
            user_groups = jsonify(user_groups)

        return user_groups

    if request.method == 'POST':
        #create new group
        print(f'entered with {request.form}')
        if validate_group_creation(request.form):
            print('the group dict is valid')
            new_group_data = {}
            for item in request.form:
                new_group_data[item] = request.form[item]

            new_group_data['owner'] = str(session.get('user').get('_id')) # set owner
            creator_info = {
                "_id": new_group_data['owner'],
                "username": session.get('user').get('username'),
                "name": session.get('user').get('name'),
                'last_name': session.get('user').get('lastname'),
                "type": "admin"
            }
            new_group_data['members'] = []
            new_group_data['members'].append(creator_info) # set owner as member with type admin
            obj = mongo.groups.insert_one(new_group_data)
            
            # update user groups in session
            if session.get('user').get('groups') is None:
                session['user']['groups'] = []
            session['user']['groups'].append({
                '_id': str(obj.inserted_id),
                'name': new_group_data['name'],
                'type': 'admin'
                })

            print('getteame lso grupos')
            print(session.get('user').get('groups'))
            mongo.users.update_one({'_id': session.get('user').get('_id')}, {'$set': {'groups': session.get('user').get('groups')}})# update user groups in db

            return {'success': f'created new group: {new_group_data.get("name")}'}

    

@app.route('/api/groups/<group_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_group(group_id):
    """route for single group, get for group info, put for group member delete, post for group members insert"""
    group = mongo.groups.find_one({'_id': ObjectId(group_id)})
    
    if group:
        if request.method == 'GET':
            # return group json object
            group['_id'] = str(group.get('_id'))
            return jsonify(group)

        if request.method == 'DELETE':
            # delete group
            id_list = []
            for item in group['members']:
                id_list.append(ObjectId(item))
            
            # remove event from user events
            for item in id_list:
                mongo.users.update_one({'_id': item},
                                    {'$pull': {'groups': {'name': group['name']}}},False,True) 
            # delete event
            mongo.groups.delete_one({'_id': ObjectId(group_id)})
            
            # update session
            user_groups = mongo.users.find_one({'_id': session.get('user').get('_id')})['groups']
            session['user']['groups'] = user_groups
            return "group deleted"
    else:
        return "group not found"


@app.route('/api/groups/<group_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def group_members(group_id):
    """manage members for groups"""
    if request.method == 'POST':
        # add member to group
        group = mongo.groups.find_one({'_id': ObjectId(group_id)})
        if group:
            user = mongo.users.find_one({'_id': ObjectId(request.get_json.get('user_id'))})
            if user:
                new_user_to_group = {}
                # {_id, type?}
                for item in request.json_get():
                    new_user_to_group[item] = request.get_json.get(item)
                new_user_to_group['username'] = str(user.get('username'))
                new_user_to_group['name'] = str(user.get('name'))
                new_user_to_group['last_name'] = str(user.get('last_name'))

                new_group_to_user = {
                    '_id': str(group.get('_id')),
                    'name': group.get('name')
                }
                mongo.groups.update_one({'_id': group['_id']}, {'$push': {'members': new_user_to_group}}) # push member to member list
                mongo.users.update_one({'_id': user['_id']}, {'$push': {f'groups': new_group_to_user}}) # push group to user groups'   
                return "user added to group"
            return {'error': 'user does not exist'}
        else:
            return {'error': 'group does not exist'}

    if request.method == 'PUT':
        # delete member from group
        group = mongo.groups.find_one({'_id': ObjectId(group_id)})
        if group:
            if mongo.groups.update_one({'_id': ObjectId(group_id)}, { '$pull': { group_id: {'members': {'_id': ObjectId(request.form.get('id'))}}}},False,True): # si puedo deletear el miembro del grupo dsp borro la id del grupo de la lista de grupos del usuario
                mongo.users.update_one({'_id': ObjectId(request.form.get('id'))},
                                       {'$pull': {'groups': {'_id': ObjectId(group_id)}}},False,True)
                return "user removed from group"
            else:
                return {'error': 'user not found'}
        else:
            return {'error': 'group not found'}
if __name__ == '__main__':
    app.run(port=5001, debug=True)