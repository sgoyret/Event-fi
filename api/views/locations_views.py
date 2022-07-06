from api.views import api_views
from bson.objectid import ObjectId
from flask import session, request, redirect, url_for, jsonify
from pymongo import MongoClient
from functions.validations import *
from api.functions.location_functions import *
from api import UPLOAD_FOLDER
import os


mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

# ---------LOCATION ROUTES----------
@api_views.route('/api/locations', strict_slashes=False, methods=['GET', 'POST'])
def locations():
    """GET and POST for locations"""
    if session.get('user') is None:
        return redirect(url_for('login'))
    
    if request.method == 'GET':
        # returns location list
        user_locations = []
        if session.get('user').get('locations'):
            for idx, l in enumerate(session.get('user').get('locations')):
                user_locations.append(l)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', l.get('location_id'))) as avt:
                        print('pude abrir el avatar')
                        user_locations[idx]['avatar'] = avt.read()
                except Exception as ex:
                    print(ex)
        return jsonify(user_locations)

    """
    if request.method == 'POST':
        #create new location
        print(f'entered with {request.get_json()}')
        if session.get('user').get('type') != 'sudo':
            return {'error': 'you must be sudo in order to create a new location'}
        to_validate = ['name', 'avatar', 'latitude', 'logitude']
        if validate_location_creation(request.get_json()):
            print('the location dict is valid')
            new_location_data = {}
            for item in request.get_json():
                new_location_data[item] = request.get_json()[item]

            admin_info = {
                'user_id': session.get('user').get('_id'),
                'username': session.get('user').get('username'),
                'name': session.get('user').get('name'),
                'last_name': session.get('user').get('last_name'),
                'type': 'admin'
            }
            new_location_data['admins'] = []
            new_location_data['admins'].append(admin_info) # set creator as admin
            obj = mongo.groups.insert_one(new_location_data)

            # update user locations in session
            if session.get('user').get('locations') is None:
                session['user']['locations'] = []
            session['user']['locations'].append({
                'location_id': str(obj.inserted_id),
                'name': new_location_data['name'],
                'type': 'admin'
                })

            print(session.get('user').get('locations'))
            mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))}, {'$push': {'locations': session.get('user').get('locations')}})# update user groups in db

            return {'success': f'created new group: {new_location_data.get("name")}'}
    """
@api_views.route('/api/locations/<location_id>', strict_slashes=False, methods=['GET'])
def location_info(location_id):
    """route for single location, get for location info"""
    if session.get('user') is None:
       return redirect(url_for('index'))

    location = None
    for item in session.get('user').get('locations'):
        if item.get('location_id') == location_id:
            location = mongo.locations.find_one({'_id': ObjectId(location_id)})
    print(location)

    if location is None:
        return {'error': 'location not found or acces denied'}

    if request.method == 'GET':
        location_response = {
            'name': location.get('name'),
            'avatar': location.get('avatar'),
            'description': location.get('description'),
            'position': location.get('position'),
            'events': location.get('events')
        }
        for admin in location.get('admins'):
            if session.get('user').get('_id') == admin.get('user_id'):
                location_response['admins'] = location.get('admins')

        return location_response

@api_views.route('/api/locations/<location_id>/admins', strict_slashes=False, methods=['GET', 'POST', 'DELETE'])
def location_admins(location_id):
    """route for single location admin management"""
    if session.get('user') is None:
       return redirect(url_for('index'))

    location = None
    for item in session.get('user').get('locations'):
        if item.get('location_id') == location_id:
            location = mongo.locations.find_one({'_id': ObjectId(location_id)})

    if location is None:
        return {'error': 'location not found or acces denied'}

    if request.method == 'GET':
        return jsonify(location.get('admins'))

    if request.get_json().get('user_id'):
        admin = mongo.users.find_one({'_id': ObjectId(request.get_json().get('user_id'))})
    elif request.get_json().get('username'):
        admin = mongo.users.find_one({'username': request.get_json().get('username')})
    if admin is None:
        return {"error": "user not found"}

    if request.method == 'POST':
        return add_location_admin(admin, location)

    if request.method == 'DELETE':
        return delete_location_admin(admin, location)
