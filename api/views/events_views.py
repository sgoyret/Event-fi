from api.views import api_views
from bson.objectid import ObjectId
from flask import Blueprint, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from functions.validations import *
from api.functions.events_functions import *
from werkzeug.security import generate_password_hash, check_password_hash
from api.views import session_refresh
import json
import requests
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
                with open(os.path.join(UPLOAD_FOLDER, 'avatars', c.get('_id'))) as avt:
                    print('pude abrir el avatar')
                    user_events[idx]['avatar'] = avt.read()
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
        return jsonify(event.get('members'))

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