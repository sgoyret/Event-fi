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

def add_new_group(req):
    """adds a new group to the database"""
    print(f'entered with {req.get_json()}')
    if validate_group_creation(req.get_json()):
        print('the group dict is valid')
        new_group_data = {}
        for item in req.get_json():
            new_group_data[item] = req.get_json()[item]

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

def delete_group(group):
    """returns the info of a group"""
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
    mongo.groups.delete_one({'_id': group['_id']})

    # update session
    user_groups = mongo.users.find_one({'_id': ObjectId(session.get('user').get('_id'))})['groups']
    session['user']['groups'] = user_groups
    return {'success': 'group has been deleted'}

def add_group_member(user, group, req):
    """adds a new member to a group"""
    for member in group.get('members'):
        if member.get('username') == user.get('username'):
            return {'error': 'user is already in group'}

    new_user_to_group = {}
    # {_id, type?}
    for item in req.get_json():
        new_user_to_group[item] = req.get_json()[item]
    new_user_to_group['username'] = str(user.get('username'))
    new_user_to_group['name'] = str(user.get('name'))
    new_user_to_group['last_name'] = str(user.get('last_name'))

    new_group_to_user = {
        'group_id': str(group.get('_id')),
        'name': group.get('name')
    }
    mongo.groups.update_one({'_id': group['_id']}, {'$push': {'members': new_user_to_group}}) # push member to member list
    mongo.users.update_one({'_id': user['_id']}, {'$push': {f'groups': new_group_to_user}}) # push group to user groups' 

    if group.get('events'):
        for event in group.get('events'):
            # POST request api/events/<event[_id]>/members {user_id: new_user_to_group[user_id]}
            # requests.post(f'http://localhost:5001/api/events/{event.get("event_id")}/members', data={"user_id": new_user_to_group['user_id']})
            print(f'i should add the {event["name"]} to the {user["username"]}')
    return {'success': 'user added to group'}

def delete_group_member(user, group, req):
    user_at = {}
    group_at_user = {}
    for idx, item in enumerate(group.get('members')):
        if item.get('username') == user.get('username'):
            user_at = group.get('members')[idx]
    for idx, item in enumerate(user.get('groups')):
        if item.get('group_id') == str(group['_id']):
            group_at_user = user.get('group')[idx]

    print(f'user to delete: {user_at}')
    if mongo.groups.update_one({'_id': group['_id']},
                                {'$pull': {'members': user_at}},False,True): # remove member from group
        mongo.users.update_one({'_id': ObjectId(req.get_json().get('user_id'))},
                                {'$pull': {'groups': group_at_user}},False,True) # remove group from user events
        if user.get('groups') and len(user.get('groups')) == 0:
            user.pop('groups') # remove groups from user if no groups left
        return "user removed from group"

def update_group_member_type(user, group, req):
    new_type = req.get_json().get('type')
    # group_at_user = {}
    group_index = None
    for idx, item in enumerate(user.get('groups')):
        if item.get('group_id') == str(group['_id']):
            # group_at_user = user.get('groups')[idx]
            group_index = idx
            break
    mongo.users.update_one({'_id': user['_id']}, {'$set': {f'groups.{group_index}.type': new_type}}) # set new type to event in user groups
    # update member type in group members
    # user_at = {}
    user_idx = None
    for idx, item in enumerate(group.get('members')):
        if item.get('user_id') == str(user['_id']):
            # user_at = group.get('members')[idx]
            user_idx = idx
            break
    mongo.groups.update_one({'_id': group['_id']}, {'$set': {f'members.{user_idx}.type': new_type}}) # set new type member in group members
    
    session_refresh()
    return {'success': 'group member updated successfully'}

def update_group_info(group, req):
    """updates a group's info"""
    new_group_data = {}
    for item in req.get_json():
        if group['item'] != req.get_json()[item]:
            new_group_data[item] = req.get_json()[item]
    mongo.groups.update_one({'_id': group['_id']}, {'$set': new_group_data})