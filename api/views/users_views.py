import os
# from app import UPLOAD_FOLDER
from api.views import api_views
from api.functions.user_functions import *
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
        contacts_with_avatar = []
        if session.get('user').get('contacts'):
            for idx, c in enumerate(session.get('user').get('contacts')):
                contacts_with_avatar.append(c)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', c.get('user_id'))) as avt:
                        print('pude abrir el avatar')
                        contacts_with_avatar[idx]['avatar'] = avt.read()
                except Exception as ex:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', 'default_user')) as avt:
                        print('pude abrir el avatar')
                        contacts_with_avatar[idx]['avatar'] = avt.read()
        return jsonify(contacts_with_avatar)

    user = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})
    if user is None:
        return redirect(url_for('index'))

    if request.method == 'POST':
        # add new contact
        return add_new_contact(user, request)
        
    
    if request.method == 'DELETE':
        # delete contact
        return delete_contact(request)

@api_views.route('/api/users/notifications', strict_slashes=False, methods=['GET', 'POST', 'DELETE'])
def get_notifications():
    if session.get('user') is None:
        return redirect(url_for('login'))

    if request.method == 'GET':
        """Refresh the usr session with updated notifications"""
        session_refresh()

    if request.method == 'DELETE':
        """removes all the notifications from the user"""
        mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))}, {'$pull': {'notifications': session.get('user').get('notifications')}})

