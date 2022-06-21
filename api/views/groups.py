import json
import requests
from api.views import api_views
from bson.objectid import ObjectId
from flask import Blueprint, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from functions.validations import *
from api.functions.groups import *
from werkzeug.security import generate_password_hash, check_password_hash
from api.views import session_refresh


mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

# ---------GROUP ROUTES----------

@api_views.route('/api/groups', strict_slashes=False, methods=['GET', 'POST'])
def groups():
    """Returns all the groups from the current logged user"""
    if session.get('user') is None:
       return redirect(url_for('index'))

    if request.method == 'GET':
        # returns groups list
        user_groups = session.get('user').get('groups')
        return jsonify(user_groups)


    if request.method == 'POST':
        #create new group
        return add_new_group(request)

@api_views.route('/api/groups/<group_id>', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
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
        return delete_group(group)

@api_views.route('/api/groups/<group_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def group_members(group_id):
    """manage members for groups"""
    if session.get('user') is None:
        return redirect(url_for('login'))

    group = mongo.groups.find_one({'_id': ObjectId(group_id)})
    if group is None:
        return {"error": "group not found"}
    user_idx = None
    for idx, item in enumerate(group.get('members')):
        print(f'{idx}: {item}')
        if item.get('user_id') == str(session.get('user').get('_id')):
            user_idx = idx
            break
    if user_idx is None:
        return {'error': 'you are not a member of this group'}

    if request.get_json().get('user_id'):
        user = mongo.users.find_one({'_id': ObjectId(request.get_json().get('user_id'))})
    elif request.get_json().get('username'):
        user = mongo.users.find_one({'username': request.get_json().get('username')})
    if user is None:
        return {"error": "user not found"}

    if group.get('members')[user_idx].get('type') != 'admin':
        return {'error': 'you are not the admin of this group'}

    if request.method == 'GET':
        return jsonify(group['members'])

    if request.method == 'POST':
        # add member to group
        return add_group_member(user, group, request)

    if request.method == 'DELETE':
        # delete member from group
        return delete_group_member(user, group, request)
        
    
    if request.method == 'PUT':
        # update member type
        return update_group_member_type(user, group, request)