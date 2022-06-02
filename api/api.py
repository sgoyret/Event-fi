import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

eventifyapi = Flask(__name__)
mongo = MongoClient('mongodb://localhost:27017/')
mongo = mongo.get_database('eventify')
cors = CORS(eventifyapi, resources={r"/*": {"origins": "0.0.0.0"}})
eventifyapi.config['CORS_HEADERS'] = 'Content-Type'

@eventifyapi.route('/events', strict_slashes=False, methods=['GET'])
def get_events():
    events = mongo.get_collection('events').find()
    return jsonify(list(events))

@eventifyapi.route('/events/<event_id>', strict_slashes=False, methods=['GET'])
def get_event(event_id):
    event = mongo.get_collection('events').find_one({'_id': event_id})
    return jsonify(event)

@eventifyapi.route('/events', strict_slashes=False, methods=['POST'])
def create_event():
    print(request.form)
    response = jsonify({'status': 'OK'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

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