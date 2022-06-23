from bson.objectid import ObjectId
from flask import Blueprint, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from functions.validations import *
from api.functions.events_functions import add_event_member
from werkzeug.security import generate_password_hash, check_password_hash
import json
from api.views import session_refresh

mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

def add_location_admin(new_admin, location):
    """adds a new admin to a location"""
    for member in location.get('admins'):
        if member.get('username') == new_admin.get('username'):
            return {'error': 'admin is already in location'}

    new_admin_to_location = {
        'user_id': str(new_admin.get('_id')),
        'username': new_admin.get('username'),
        'name': new_admin.get('name'),
        'last_name': new_admin.get('last_name'),
        'avatar': new_admin.get('avatar')
    }

    new_location_to_user = {
        'location_id': str(location.get('_id')),
        'name': location.get('name'),
        'avatar': location.get('avatar')
    }
    mongo.locations.update_one({'_id': location['_id']}, {'$push': {'admins': new_admin_to_location}}) # push member to member list
    mongo.users.update_one({'_id': new_admin['_id']}, {'$push': {f'locations': new_location_to_user}}) # push location to admin groups' 

    return {'success': 'user added to location'}

def delete_location_admin(admin, location):
    """removes an admin to a location"""
    
    am_admin = False
    for member in location.get('members'):
        if member.get('user_id') == session.get('user').get('_id'):
            am_admin = True
        if member.get('user_id') == str(admin.get('_id')):
            break
        return {'error': 'admin to delete is not on the list'}
    if am_admin is False:
        return {'error': 'you are not the admin for this location'}

    admin_at = {}
    location_at_user = {}
    for idx, item in enumerate(location.get('admins')):
        if item.get('user_id') == str(admin.get('_id')):
            admin_at = location.get('members')[idx]
    for idx, item in enumerate(admin.get('locations')):
        if item.get('location_id') == str(admin['_id']):
            location_at_user = admin.get('locations')[idx]

    print(f'user to delete: {admin_at}')
    if mongo.locations.update_one({'_id': location['_id']},
                                {'$pull': {'admins': admin_at}},False,True): # remove admin from location
        mongo.users.update_one({'_id': admin.get('_id')},
                                {'$pull': {'locations': location_at_user}},False,True) # remove location from user
        if admin.get('locations') and len(admin.get('locations')) == 0:
            admin.pop('locations') # remove groups from user if no groups left
        return {'success': 'admin removed from location'}

def delete_location(location):
    """deletes a location and removes it from its admins"""
    print('entered delete')
    if session.get('user').get('_id') != location.get('owner'):
        return {'error': 'you are not the owner of the group'}
    id_list = []
    for item in location['admins']:
        id_list.append(ObjectId(item.get('user_id')))
    # remove event from user events
    for item in id_list:
        mongo.users.update_one({'_id': item},
                            {'$pull': {'locations': {'name': location['name']}}},False,True) 
    # delete event
    print('for each event call delete_event_group with group to delete')
    location_at_user = {
        'location_id': str(location.get('_id')),
        'name': location.get('name'),
        'avatar': location.get('avatar')
    }
    for admin in location.get('admins'):
        mongo.users.find({'_id': ObjectId(admin.get('user_id'))}, {'$pull': {'locations': location_at_user}})
    # update session
    session_refresh()
    return {'success': 'location has been deleted'}