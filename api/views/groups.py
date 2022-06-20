from api.views import api_views
from bson.objectid import ObjectId
from flask import Blueprint, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from functions.validations import *
from werkzeug.security import generate_password_hash, check_password_hash
import json


mongo = MongoClient('mongodb+srv://Eventify:superuser@cluster0.cm2bh.mongodb.net/test')
mongo = mongo.get_database('EVdb')

# ---------GROUP ROUTES----------

@api_views.route('/api/groups', strict_slashes=False, methods=['GET', 'POST', 'DELETE'])
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
        print(f'entered with {request.get_json()}')
        if validate_group_creation(request.get_json()):
            print('the group dict is valid')
            new_group_data = {}
            for item in request.get_json():
                new_group_data[item] = request.get_json()[item]

            new_group_data['owner'] = str(session.get('user').get('_id')) # set owner
            creator_info = {
                "user_id": new_group_data['owner'],
                "username": session.get('user').get('username'),
                "name": session.get('user').get('name'),
                'last_name': session.get('user').get('lastname'),
                "type": "admin"
            }
            new_group_data['members'] = []
            new_group_data['members'].append(creator_info) # set owner as member with type admin
            obj = mongo.groups.insert_one(new_group_data)
            
            # update user groups in session
            if session.get('user').get('groups') is None:
                session['user']['groups'] = []
            session['user']['groups'].append({
                'group_id': str(obj.inserted_id),
                'name': new_group_data['name'],
                'type': 'admin'
                })

            print('getteame lso grupos')
            print(session.get('user').get('groups'))
            mongo.users.update_one({'_id': ObjectId(session.get('user').get('_id'))}, {'$set': {'groups': session.get('user').get('groups')}})# update user groups in db

            return {'success': f'created new group: {new_group_data.get("name")}'}

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
        print('entered delete')
        if session.get('user').get('_id') != group.get('owner'):
            return {'error': 'you are not the owner of the group'}
        id_list = []
        for item in group['members']:
            id_list.append(ObjectId(item.get('user_id')))
        # remove event from user events
        for item in id_list:
            mongo.users.update_one({'_id': item},
                                   {'$pull': {'groups': {'name': group['name']}}},False,True) 
        # delete event
        print('going to delete group')
        mongo.groups.delete_one({'_id': ObjectId(group_id)})

        # update session
        user_groups = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})['groups']
        session['user']['groups'] = user_groups
        return {'success': 'group has been deleted'}

@api_views.route('/api/groups/<group_id>/members', strict_slashes=False, methods=['GET', 'PUT', 'POST', 'DELETE'])
def group_members(group_id):
    """manage members for groups"""
    if session.get('user') is None:
        return redirect(url_for('login'))

    group = mongo.groups.find_one({'_id': ObjectId(group_id)})
    if group is None:
        return {"error": "group not found"}
    user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
    if user is None:
        return {"error": "user not found"}
    user_idx = None
    for idx, item in enumerate(group.get('members')):
        print(f'{idx}: {item}')
        if item.get('user_id') == str(session.get('user').get('_id')):
            user_idx = idx
            break
    if user_idx is None:
        return {'error': 'you are not a member of this group'}

    if group.get('members')[user_idx].get('type') != 'admin':
        return {'error': 'you are not the admin of this group'}

    if request.method == 'GET':
        return jsonify(group['members'])
    if request.method == 'POST':
        # add member to group
        new_user_to_group = {}
        # {_id, type?}
        for item in request.form:
            new_user_to_group[item] = request.form[item]
        new_user_to_group['username'] = str(user.get('username'))
        new_user_to_group['name'] = str(user.get('name'))
        new_user_to_group['last_name'] = str(user.get('last_name'))

        new_group_to_user = {
            '_id': str(group.get('_id')),
            'name': group.get('name')
        }
        mongo.groups.update_one({'_id': group['_id']}, {'$push': {'members': new_user_to_group}}) # push member to member list
        mongo.users.update_one({'_id': user['_id']}, {'$push': {f'groups': new_group_to_user}}) # push group to user groups'   
        return "user added to group"

    if request.method == 'DELETE':
        # delete member from group
        user_at = {}
        group_at_user = {}
        for idx, item in enumerate(group.get('members')):
            if item.get('user_id') == request.get_json().get('user_id'):
                user_at = group.get('members')[idx]
        for idx, item in enumerate(user.get('groups')):
            if item.get('_id') == group_id:
                group_at_user = user.get('group')[idx]

        print(f'user to delete: {user_at}')
        if mongo.groups.update_one({'_id': group['_id']},
                                   {'$pull': {'members': user_at}},False,True): # remove member from group
            mongo.users.update_one({'_id': ObjectId(request.get_json().get('user_id'))},
                                   {'$pull': {'groups': group_at_user}},False,True) # remove group from user events
            if user.get('groups') and len(user.get('groups')) == 0:
                user.pop('groups') # remove groups from user if no groups left
            return "user removed from group"
    
    if request.method == 'PUT':
        # update member type
        user = mongo.users.find_one({'_id': ObjectId(request.form.get('user_id'))})
        if user is None:
            return {'error': 'user does not exist'}

        # update member type in user groups
        new_type = request.form.get('type')
        group_at_user = {}
        group_index = None
        for idx, item in enumerate(user.get('groups')):
            if item.get('_id') == group_id:
                group_at_user = user.get('groups')[idx]
                group_index = idx
                break
        mongo.users.update_one({'_id': user['_id']}, {'$set': {f'groups.{group_index}.type': new_type}}) # set new type to event in user groups
        # update member type in group members
        user_at = {}
        user_idx = None
        for idx, item in enumerate(group.get('members')):
            if item.get('user_id') == str(user['_id']):
                user_at = group.get('members')[idx]
                user_idx = idx
                break
        mongo.groups.update_one({'_id': group['_id']}, {'$set': {f'members.{user_idx}.type': new_type}}) # set new type member in group members
        
        session_refresh()
        return {'success': 'group member updated successfully'}