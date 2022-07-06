from api.views import api_views
from bson.objectid import ObjectId
from flask import session, request, redirect, url_for, jsonify
from pymongo import MongoClient
from functions.validations import *
from api.functions.events_functions import *
from api import UPLOAD_FOLDER
import os


mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

# ---------event ROUTES----------
@api_views.route('/api/events', strict_slashes=False, methods=['GET', 'POST'])
def events():
    """Returns all the events from the current logged user"""
    if session.get('user') is None:
       return redirect(url_for('login'))
    
    if request.method == 'GET':
        # returns events list
        # session['user']['events'] = {'id1': {'avatar':'', 'title':'Graduation', 'location':'Holberton School', 'date': '20/06/2022'},
        #                              'id2': {'avatar':'', 'title':'First job', 'location':'A very good company', 'date': '01/07/2022'}}
        user_events = []
        if session.get('user').get('events'):
            for idx, e in enumerate(session.get('user').get('events')):
                user_events.append(e)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', e.get('_id'))) as avt:
                        print('pude abrir el avatar')
                        user_events[idx]['avatar'] = avt.read()
                except Exception as ex:
                    print(ex)
                if e.get('members'):
                    members_with_avatar = []
                    for idx, m in enumerate(e.get('members')):
                        members_with_avatar.append(m)
                        try:
                            with open(os.path.join(UPLOAD_FOLDER, 'avatars', m.get('user_id'))) as avt:
                                print('pude abrir el avatar')
                                members_with_avatar[idx]['avatar'] = avt.read()
                        except Exception as ex:
                            with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                                print('pude abrir el avatar')
                                members_with_avatar[idx]['avatar'] = avt.read()
                    user_events[idx]['members'] = members_with_avatar
        return jsonify(user_events)
        
    if request.method == 'POST':
        # create new event
        return add_new_event(request)
        

@api_views.route('/api/events/<event_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def single_event(event_id):
    """route for single event, get for event info, put for event member delete, post for event members insert"""
    if not session.get('user'):
        return redirect(url_for('login'))

    print(event_id)
    event = mongo.events.find_one({'_id': ObjectId(event_id)})
    print(event)
    if event is None:
        return {'error': 'event does not exist'}
    
    user_idx = None
    for idx, item in enumerate(event.get('members')):
        if item.get('user_id') == session.get('user').get('_id'):
            user_idx = idx
            print('found user')
            break
    if user_idx is None:
        return {'error': 'event information only for members'}


    if request.method == 'GET':
        # return event json object
        event['_id'] = str(event['_id'])
        user_type = event['members'][user_idx]['type']
        event['type'] = user_type
        # turn event avatar from route to actual image
        try:
            with open(os.path.join(UPLOAD_FOLDER, 'avatars', event.get('_id'))) as avt:
                print('pude abrir el avatar')
                event['avatar'] = avt.read()
        except Exception as ex:
            print(ex)
        # turn event members avatars from route to actual image
        if event.get('members'):
            members_with_avatar = []
            for idx, m in enumerate(event.get('members')):
                members_with_avatar.append(m)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', m.get('user_id'))) as avt:
                        print('pude abrir el avatar')
                        members_with_avatar[idx]['avatar'] = avt.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                        print('pude abrir el avatar')
                        members_with_avatar[idx]['avatar'] = avt.read()
            event['members'] = members_with_avatar
        # turn event groups avatars from route to actual image
        if event.get('groups'):
            groups_with_avatar = []
            for idx, g in enumerate(event.get('groups')):
                groups_with_avatar.append(m)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', g.get('user_id'))) as avt:
                        print('pude abrir el avatar')
                        groups_with_avatar[idx]['avatar'] = avt.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                        print('pude abrir el avatar')
                        groups_with_avatar[idx]['avatar'] = avt.read()
            event['groups'] = groups_with_avatar
        return jsonify(event)
    
    if request.method == 'PUT':
        # update event information
        return update_event_info(event, request)

    if request.method == 'DELETE':
        # delete event
        return delete_event(event, request)

@api_views.route('/api/events/<event_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
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
        if item.get('user_id') == session.get('user').get('_id'):
            user_idx = idx
            break
    if user_idx is None:
        return {'error': 'event information only for members'}
    if request.get_json().get('user_id'):
        user = mongo.users.find_one({'_id': ObjectId(request.get_json().get('user_id'))})
    elif request.get_json().get('user_id'):
        user = mongo.users.find_one({'username': request.get_json().get('username')})
    if user is None:
        return {"error": "user not found"}
    


    if request.method == 'GET':
        if event.get('members'):
            members_with_avatar = []
            for idx, m in enumerate(event.get('members')):
                members_with_avatar.append(m)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', m.get('user_id'))) as avt:
                        print('pude abrir el avatar')
                        members_with_avatar[idx]['avatar'] = avt.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                        print('pude abrir el avatar')
                        members_with_avatar[idx]['avatar'] = avt.read()
        return jsonify(members_with_avatar)

    if request.method == 'POST':
        # add member to event
        return add_event_member(event, user, request.get_json())

    if request.method == 'PUT':
        # update member type
        return update_event_member(event, user, request)
              
    if request.method == 'DELETE':
        # delete member from event
        print('adios')
        return delete_event_member(event, user, user_idx, request)


@api_views.route('/api/events/<event_id>/groups', strict_slashes=False, methods=['GET', 'POST','DELETE'])
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
        print(session.get('user').get('_id'))

        if item.get('user_id') == session.get('user').get('_id'):
            user_idx = idx
            print('found user')
            break
    if user_idx is None:
        return {'error': 'event information only for members'}

    if request.method == 'GET':
        return jsonify(event.get('groups'))

    # must change to request.get_json().get()
    group = mongo.groups.find_one({'_id': ObjectId(request.get_json().get('group_id'))})
    if group is None:
        return {'error': 'group does not exist'}

    if request.method == 'POST':
        return add_event_group(group, event)

    if request.method == 'DELETE':
        return delete_event_group(group, event)