import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

eventifyapi = Flask(__name__)
mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')
cors = CORS(eventifyapi, resources={r"/*": {"origins": "*"}})
eventifyapi.config['CORS_HEADERS'] = 'Content-Type'

@eventifyapi.route('/events', strict_slashes=False, methods=['GET', 'POST'])
def get_events():
    events = mongo.get_collection('events').find()
    event_list = []
    for item in events:
        item['_id'] = str(item.get('_id'))
        event_list.append(item)
    return jsonify(event_list)

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['GET'])
def get_event(event_id):
    event = mongo.get_collection('events').find_one({'_id': ObjectId(event_id)})
    print(event)
    event['_id'] = str(event.get('_id'))
    return jsonify(event)

@eventifyapi.route('/events', strict_slashes=False, methods=['POST'])
def create_event():
    obj = mongo.get_collection('events').insert_one(request.json)
    if obj is None:
        return ({"Status":"Failed"})
    else:
        return (str(obj.inserted_id), 201)

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['PUT'])
def update_event(event_id):
    event = request.get_json()
    mongo.get_collection('events').update_one({'_id': event_id}, {'$set': event})
    return jsonify(event)

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['DELETE'])
def delete_event(event_id):
    mongo.get_collection('events').delete_one({'_id': event_id})
    return jsonify({'result': True})

if __name__ == '__main__':
    eventifyapi.run(debug=True)