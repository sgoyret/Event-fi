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
    user_id = session.get('user').get('_id')
    user = mongo.users.find_one({'_id': ObjectId(user_id)})
    user['_id'] = str(user_id)
    session['user'] = user

@app.route('/', strict_slashes=False)
@app.route('/index', methods=['GET'], strict_slashes=False)
def index():
    """user base page"""
    # checks if session exists
    if session.get('user'):
        session_refresh()
        return render_template('index.html', session=session)
    return redirect(url_for('login'))

@app.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    """log in for the user with register option"""
    if request.method == 'GET':
        if session.get('user'):
            return redirect(url_for('index'))
        return render_template('login.html')

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
        check_response = validate_user_creation(request.form)
        if check_response is True:             
            print('the dictionary is valid')
            new_data = {}
            for item in request.form:
                new_data[item] = request.form[item]
            if mongo.users.find_one({'username': new_data['username']}) is None:
                new_data['password'] = generate_password_hash(new_data['password'])
                new_data['type'] = 'user'
                collection= mongo.users
                obj = collection.insert_one(new_data)
                new_data.pop('password')
                new_data['_id'] = str(obj.inserted_id)
                session['user'] = new_data
                return redirect(url_for('index'))
            else:
                return {'error': 'the username is already in use'}
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
        # return render_template('settings.html', user=session['user'])
        return jsonify(session['user'])
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
        mongo.users.update_one({'_id': ObjectId(session['user']['_id'])}, {'$set': update_data})
        session_refresh()
        return redirect(url_for('user'))
        
    
        

# *********************** HOLA API **********************
# ---------USER ROUTES----------
"""
@app.route('/api/users', methods=['GET'], strict_slashes=False)
def users():
    ""get all users""
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
""" 
@app.route('/api/users/<user_id>', strict_slashes=False, methods=['GET'])
def get_user(user_id):
    """returns user with matching id else error"""
    if session.get('user') is None:
        return redirect(url_for('login'))
    user = mongo.users.find_one({'_id': ObjectId(user_id)})
    if user:
        user['_id'] = str(user.get('_id'))
        return jsonify(user)
    else:
        return "user not found"
    
@app.route('/api/users/contacts', strict_slashes=False, methods=['POST', 'GET', 'DELETE'])
def contacts():
    if session.get('user') is None:
        return redirect(url_for('login'))
    user = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})
    if user is None:
        return {"error": "user not found"}
    
    if request.method == 'GET':
        #return all user contacts
        return jsonify(user.get('contacts'))
    
    if request.method == 'POST':
        # add new contact
        new_contact = mongo.users.find_one({'_id': ObjectId(request.form['user_id'])})
        if new_contact is None:
            return {'error': 'user does not exist'}
        keys_to_pop = ['password', 'email', 'events', 'groups']
        for item in keys_to_pop:
            new_contact.pop(item)
        new_contact['_id'] = str(new_contact['_id'])
        # add contact in session
        if session.get('user').get('contacts') is None:
            session['user']['contacts'] = []
        session['user']['contacts'].append(new_contact)
        # add contact in db
        mongo.users.update_one({'_id': user['_id']},
                               {'$push': {'contacts': new_contact}})
        return jsonify(session['user']['contacts']), 201
    
    if request.method == 'DELETE':
        # delete contact
        contact_to_delete = mongo.users.find_one({'_id': ObjectId(request.form['user_id'])})
        if contact_to_delete is None:
            return {'error': 'user does not exist'}
        keys_to_pop = ['password', 'email', 'events', 'groups']
        for item in keys_to_pop:
            contact_to_delete.pop(item)
        contact_to_delete['_id'] = str(contact_to_delete['_id'])
        # remove contact in session
        if session.get('user').get('contacts'):
            print(session['user']['contacts'])
            session['user']['contacts'].remove(contact_to_delete)
            if len(session['user']['contacts']) == 0:
                session['user'].pop('contacts') # if no contacts left pop contacts list
        # remove contact in db
        mongo.users.update_one({'_id': user['_id']},
                               {'$pull': {'contacts': contact_to_delete}})
        if mongo.users.find_one({{ 'contacts.0': {'$exists' : False }}}):
            mongo.users.update_one({'_id': user['_id']},
                                   {'$pull': 'contacts'})# if no contacts left pop contact list
        return {"success": "contact deleted"}

    
# ---------event ROUTES----------
@app.route('/api/events', strict_slashes=False, methods=['GET', 'POST'])
def events():
    """Returns all the events from the current logged user"""
    if session.get('user') is None:
       return redirect(url_for('login'))
    
    if request.method == 'GET':
        # returns events list
        # session['user']['events'] = {'id1': {'avatar':'', 'title':'Graduation', 'location':'Holberton School', 'date': '20/06/2022'},
        #                              'id2': {'avatar':'', 'title':'First job', 'location':'A very good company', 'date': '01/07/2022'}}
        user_events = session.get('user').get('events')
        if user_events:
            return jsonify(user_events)
        else:
            return 'no current events'
    
    if request.method == 'POST':
        # create new event
        if validate_event_creation(request.get_json()):
            print('the event dict is valid')
            new_event_data = {}
            for item in request.get_json():
                new_event_data[item] = request.get_json().get(item)
    
            new_event_data['owner'] = str(session.get('user').get('_id')) # set owner
            owner_admin = {
                'user_id': new_event_data['owner'],
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
            mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))}, {'$set': {'events': session.get('user').get('events')}}) # update user events in db
            
            return redirect(url_for('events'))

@app.route('/api/events/<event_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_event(event_id):
    """route for single event, get for event info, put for event member delete, post for event members insert"""
    if not session.get('user'):
        return redirect(url_for('login'))

    event = mongo.events.find_one({'_id': ObjectId(event_id)})
    if event is None:
        return {'error': 'event does not exist'}
    
    user_idx = None
    for idx, item in enumerate(event.get('members')):
        print(f'{idx}: {item}')
        print(session.get('user').get('user_id'))

        if item.get('user_id') == session.get('user').get('_id'):
            user_idx = idx
            print('found user')
            break
    if user_idx is None:
        return {'error': 'event information only for members'}


    if request.method == 'GET':
        # return event json object
        event['_id'] = str(event.get('_id'))
        return jsonify(event)

    if request.method == 'DELETE':
        # delete event
        if event.get('owner') != str(session.get('user').get('_id')):
            return {'error': 'you are not the owner of the event'}
        id_list = []
        for item in event['members']:
            id_list.append(ObjectId(item))
        for item in id_list:
            mongo.users.update_one({'_id': item},
                                    {'$pull': {'events': {'name': event['name']}}},False,True) # remove event from user events
        mongo.events.delete_one({'_id': ObjectId(event_id)})
        
        # update session
        user_events = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})['events']
        session['user']['events'] = user_events

        return {'success': 'event deleted'}

@app.route('/api/events/<event_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def event_members(event_id):
    """route for event member managment"""
    if session.get('user') is None:
        return(redirect(url_for('login')))

    event = mongo.events.find_one({'_id': ObjectId(event_id)})
    if event is None:
        return {'error': 'event does not exist'}

    user_idx = None
    for idx, item in enumerate(event.get('members')):
        print(f'{idx}: {item}')
        print(session.get('user').get('user_id'))

        if item.get('user_id') == session.get('user').get('_id'):
            user_idx = idx
            print('found user')
            break
    if user_idx is None:
        return {'error': 'event information only for members'}

    if request.method == 'POST':
        # add member to event
        if event.get('members')[user_idx].get('type') != 'admin':
            return {'error': 'you are not the admin of this event'}
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
        # update member type
        if event.get('members')[user_idx].get('type') != 'admin':
            return {'error': 'you are not the admin of this event'}
        user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
        if user is None:
            return {'error': 'user does not exist'}

        # update member type in user events
        new_type = request.form.get('type')
        event_at_user = {}
        event_index = None
        for idx, item in enumerate(user.get('events')):
            if item.get('user_id') == event_id:
                event_at_user = user.get('events')[idx]
                event_index = idx
                break
        mongo.users.update_one({'_id': user['_id']}, {'$set': {f'events.{event_index}.type': new_type}}) # set new type to event in user events
        # update member type in event members
        user_at = {}
        mongo.events.update_one({'_id': event['_id']}, {'$set': {f'members.{user_idx}.type': new_type}}) # set new type member in event members
        
        session_refresh()
        return {"success": "event member updated successfully"}
              
    if request.method == 'DELETE':
        # delete member from event
        if event.get('members')[user_idx].get('type') != 'admin':
            return {'error': 'you are not the admin of this event'}
        user = mongo.users.find_one({'_id': ObjectId(request.get_json().get('user_id'))})
        if user is None:
            return {'error': 'user does not exist'}

        user_at = {}
        event_at_user = {}
        for idx, item in enumerate(event.get('members')):
            if item.get('user_id') == request.get_json().get('user_id'):
                user_at = event.get('members')[idx]

        for idx, item in enumerate(user.get('events')):
            if item.get('_id') == event_id:
                event_at_user = user.get('events')[idx]

        if mongo.events.update_one({'_id': event['_id']},
                                   {'$pull': {'members': user_at}},False,True):
            mongo.users.update_one({'_id': ObjectId(request.get_json().get('user_id'))},
                                   {'$pull': {'events': event_at_user}},False,True) # remove event from user events
            if user.get('events') and len(user.get('events')) == 0:
                user.pop('events')
            return {'success': 'user removed from event'}
        else:
            return {'error': 'user not found'}


@app.route('/api/events/<event_id>/groups', strict_slashes=False, methods=['GET', 'POST','DELETE'])
def event_groups(event_id):
    """methos for managing the groups of a given event"""
    if session.get('user') is None:
        return(redirect(url_for('login')))

    event = mongo.events.find_one({'_id': ObjectId(event_id)})
    if event is None:
        return {'error': 'event does not exist'}

    user_idx = None
    for idx, item in enumerate(event.get('members')):
        print(f'{idx}: {item}')
        print(session.get('user').get('user_id'))

        if item.get('user_id') == session.get('user').get('_id'):
            user_idx = idx
            print('found user')
            break
    if user_idx is None:
        return {'error': 'event information only for members'}

    if request.method == 'GET':
        return jsonify(event.get('groups'))

    if request.method == 'POST':
        print(event.get('members')[user_idx].get('type'))
        if event.get('members')[user_idx].get('type') != 'admin':
            return {'error': 'you are not the admin of this event'}
            #change to get_json
        group = mongo.groups.find_one({'_id': ObjectId(request.form.get('group_id'))})
        if group is None
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
        print(f'entered with {request.get_json()}')
        if validate_group_creation(request.get_json()):
            print('the group dict is valid')
            new_group_data = {}
            for item in request.get_json():
                new_group_data[item] = request.get_json()[item]

            new_group_data['owner'] = str(session.get('user').get('_id')) # set owner
            creator_info = {
                "user_id": new_group_data['owner'],
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
            mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))}, {'$set': {'groups': session.get('user').get('groups')}})# update user groups in db

            return {'success': f'created new group: {new_group_data.get("name")}'}

@app.route('/api/groups/<group_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_group(group_id):
    """route for single group, get for group info, put for group member delete, post for group members insert"""
    if session.get('user') is None:
       return redirect(url_for('index'))

    group = mongo.groups.find_one({'_id': ObjectId(group_id)})
    if group is None:
        return {'error': 'group not found'}

    user_idx = None
    for idx, item in enumerate(group.get('members')):
        print(f'group members: {idx}: {item}')
        if session.get('user').get('_id') == item.get('user_id'):
            user_idx = idx
            break
    if user_idx is None:
        return {'error': 'group information only for members'}

    if request.method == 'GET':
        # return group json object
        return jsonify(group)

    if request.method == 'DELETE':
        # delete group
        print('entered delete')
        if session.get('user').get('_id') != group.get('owner'):
            return {'error': 'you are not the owner of the group'}
        id_list = []
        for item in group['members']:
            id_list.append(ObjectId(item.get('user_id')))
        # remove event from user events
        for item in id_list:
            mongo.users.update_one({'_id': item},
                                   {'$pull': {'groups': {'name': group['name']}}},False,True) 
        # delete event
        print('going to delete group')
        mongo.groups.delete_one({'_id': ObjectId(group_id)})

        # update session
        user_groups = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})['groups']
        session['user']['groups'] = user_groups
        return {'success': 'group has been deleted'}

@app.route('/api/groups/<group_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def group_members(group_id):
    """manage members for groups"""
    if session.get('user') is None:
        return redirect(url_for('login'))

    group = mongo.groups.find_one({'_id': ObjectId(group_id)})
    if group is None:
        return {"error": "group not found"}
    user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
    if user is None:
        return {"error": "user not found"}
    user_idx = None
    for idx, item in enumerate(group.get('members')):
        print(f'{idx}: {item}')
        if item.get('user_id') == str(session.get('user').get('_id')):
            user_idx = idx
            break
    if user_idx is None:
        return {'error': 'you are not a member of this group'}

    if group.get('members')[user_idx].get('type') != 'admin':
        return {'error': 'you are not the admin of this group'}

    if request.method == 'POST':
        # add member to group
        new_user_to_group = {}
        # {_id, type?}
        for item in request.form:
            new_user_to_group[item] = request.form[item]
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

    if request.method == 'DELETE':
        # delete member from group
        user_at = {}
        group_at_user = {}
        for idx, item in enumerate(group.get('members')):
            if item.get('user_id') == request.get_json().get('user_id'):
                user_at = group.get('members')[idx]
        for idx, item in enumerate(user.get('groups')):
            if item.get('_id') == group_id:
                group_at_user = user.get('group')[idx]

        print(f'user to delete: {user_at}')
        if mongo.groups.update_one({'_id': group['_id']},
                                   {'$pull': {'members': user_at}},False,True): # remove member from group
            mongo.users.update_one({'_id': ObjectId(request.get_json().get('user_id'))},
                                   {'$pull': {'groups': group_at_user}},False,True) # remove group from user events
            if user.get('groups') and len(user.get('groups')) == 0:
                user.pop('groups') # remove groups from user if no groups left
            return "user removed from group"
    
    if request.method == 'PUT':
        # update member type
        user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
        if user is None:
            return {'error': 'user does not exist'}

        # update member type in user groups
        new_type = request.form.get('type')
        group_at_user = {}
        group_index = None
        for idx, item in enumerate(user.get('groups')):
            if item.get('_id') == group_id:
                group_at_user = user.get('groups')[idx]
                group_index = idx
                break
        mongo.users.update_one({'_id': user['_id']}, {'$set': {f'groups.{group_index}.type': new_type}}) # set new type to event in user groups
        # update member type in group members
        user_at = {}
        user_idx = None
        for idx, item in enumerate(group.get('members')):
            if item.get('user_id') == str(user['_id']):
                user_at = group.get('members')[idx]
                user_idx = idx
                break
        mongo.groups.update_one({'_id': group['_id']}, {'$set': {f'members.{user_idx}.type': new_type}}) # set new type member in group members
        
        session_refresh()
        return {'success': 'group member updated successfully'}

if __name__ == '__main__':
    app.run(port=5001, debug=True)