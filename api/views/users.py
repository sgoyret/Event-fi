from api.views import api_views
from api.functions.user import *
"""
from bson.objectid import ObjectId
from flask import Blueprint, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from functions.validations import *
from werkzeug.security import generate_password_hash, check_password_hash
import json
from api.views import session_refresh


mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')
"""
# ---------USER ROUTES----------
"""
@api_views.route('/api/users', methods=['GET'], strict_slashes=False)
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
@api_views.route('/api/users/<user_id>', strict_slashes=False, methods=['GET'])
def get_user(user_id):
    """returns user with matching id else error"""
    if session.get('user') is None:
        return redirect(url_for('login'))
    return get_user_info(user_id)
    """
    
    user = mongo.users.find_one({'_id': ObjectId(user_id)})
    if user:
        user['_id'] = str(user.get('_id'))
        return jsonify(user)
    else:
        return {'error': 'user not found'}
    """
    
@api_views.route('/api/users/contacts', strict_slashes=False, methods=['POST', 'GET', 'DELETE'])
def contacts():
    """returns the contacts of the logged user"""
    if session.get('user') is None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        #return all user contacts
        return jsonify(session.get('user').get('contacts'))

    user = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})
    if user is None:
        return {"error": "user not found"}
    
    if request.method == 'POST':
        # add new contact
        return add_new_contact(user, request)
        
    
    if request.method == 'DELETE':
        # delete contact
        return delete_contact(request)
        contact_to_delete = mongo.users.find_one({'_id': ObjectId(request.get_json().get('user_id'))})
        if contact_to_delete is None:
            return {'error': 'user does not exist'}
        keys_to_pop = ['password', 'email', 'events', 'groups']
        for item in keys_to_pop:
            contact_to_delete.pop(item)
        contact_to_delete['user_id'] = str(contact_to_delete['_id'])
        # remove contact in session
        if session.get('user').get('contacts'):
            print(session['user']['contacts'])
            session['user']['contacts'].remove(contact_to_delete)
            if len(session['user']['contacts']) == 0:
                session['user'].pop('contacts') # if no contacts left pop contacts list
        # remove contact in db
        mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))},
                               {'$pull': {'contacts': contact_to_delete}})
        if mongo.users.find_one({{ 'contacts.0': {'$exists' : False }}}):
            mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))},
                                   {'$pull': 'contacts'})# if no contacts left pop contact list
        return {"success": "contact deleted"}