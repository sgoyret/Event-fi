from asyncio import events
import json
from tokenize import group
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS

eventifyapi = Flask(__name__)
eventifyapi.config['MONGO_URI'] = 'mongodb://localhost/events_db'
mongo = PyMongo(eventifyapi)
cors = CORS(eventifyapi, resources={r"/*": {"origins": "*"}})
eventifyapi.config['CORS_HEADERS'] = 'Content-Type'

# ----USER ROUTES----
"""
@eventifyapi.route('/users', methods=['GET'], strict_slashes=False)
def users():
    #""get all users""
    if session.get(['user']):
    users = mongo.get_collection('users').find()
    
        user_list = []
        for item in users:
            item['_id'] = str(item.get('_id'))
            user_list.append(item)
        return jsonify(user_list)
    else:
        return "no users found"
"""
@eventifyapi.route('/users/<user_id>', strict_slashes=False, methods=['GET'])
def get_user(user_id):
    """returns user with matching id else error"""
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        user['_id'] = str(user.get('_id'))
        return jsonify(user)
    else:
        return "user not found"

@eventifyapi.route('/users/<user_id>/contacts', strict_slashes=False, methods=['GET'])
def get_contacts(user_id):
    """returns json representation of a user contacts"""
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        contacts = user['contacts']
        for item in contacts:
            item['_id'] = str(item.get('_id'))
        return jsonify(contacts)

@eventifyapi.route('/users/<user_id>/events', strict_slashes=False, methods=['GET'])
def get_contact_events(user_id):
    """returns json representation of the events the user is part of"""
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        events = user['events']
        for item in events:
            item['_id'] = str(item.get('_id'))
        return jsonify(events)

# ----EVENT ROUTES----

@eventifyapi.route('/events', strict_slashes=False, methods=['GET'])
def get_events():
    """returns a list with all events in database"""
    events = mongo.db.events.find()
    if events:
        event_list = []
        for item in events:
            item['_id'] = str(item.get('_id'))
            event_list.append(item)
        return jsonify(event_list)
    else:
        return "no events found"

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['GET'])
def get_event(event_id):
    """returns event with matching id else error"""
    event = mongo.db.events.find_one({'_id': ObjectId(event_id)})
    if event:
        event['_id'] = str(event.get('_id'))
        return jsonify(event)
    else:
        return "event not found"

@eventifyapi.route('/events', strict_slashes=False, methods=['POST'])
def create_event():
    """creates a new event"""
    obj = mongo.db.events.insert_one(request.json)
    if obj is None:
        return ({"Status":"Failed"})
    else:
        return (str(obj.inserted_id), 201)

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['PUT'])
def update_event(event_id):
    """update event for given event_id"""
    event = request.get_json()
    if event:
        mongo.db.events.update_one({'_id': ObjectId(event_id)}, {'$set': event})
        return jsonify(event)
    else:
        return "Something Failed"

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['DELETE'])
def delete_event(event_id):
    """delete event for given event_id"""
    mongo.db.events.delete_one({'_id': ObjectId(event_id)})
    return jsonify({'result': True})

# ----GROUPS ROUTES----

@eventifyapi.route('/groups', strict_slashes=False, methods=['GET', 'POST'])
def groups():
    """Returns a json representation with all the groups that are in the database"""
    if request.method == 'GET':
        groups = mongo.db.groups.find()
        if groups:
            group_list = []
            for item in groups:
                item['_id'] = str(item.get('_id'))
                group_list.append(item)
            return jsonify(group_list)
        else:
            return "no groups found"
    if request.method == 'POST':
        obj = mongo.db.groups.insert_one(request.json)
        if obj is None:
            return ({"Status":"Failed"})
        else:
            return (str(obj.inserted_id), 201)

@eventifyapi.route('/groups/<group_id>', strict_slashes=False, methods=['GET'])
def get_group(group_id):
    """returns group with matching id else error"""
    group = mongo.db.groups.find_one({'_id': ObjectId(group_id)})
    if group:
        group['_id'] = str(group.get('_id'))
        return jsonify(group)
    else:
        return "group not found"



if __name__ == '__main__':
    eventifyapi.run(debug=True)