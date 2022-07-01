from api.views import api_views
from bson.objectid import ObjectId
from flask import session, request, redirect, url_for, jsonify
from pymongo import MongoClient
from functions.validations import *
from api.functions.groups_functions import *
from api import UPLOAD_FOLDER


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
        user_groups = []
        if session.get('user').get('groups'):
            for idx, g in enumerate(session.get('user').get('groups')):
                user_groups.append(g)
                try:
                    with open(os.path.join(UPLOAD_FOLDER, 'avatars', g.get('_id'))) as avt:
                        print('pude abrir el avatar')
                        user_groups[idx]['avatar'] = avt.read()
                except Exception as ex:
                    print(ex)
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
        group_data = {}
        for key in group:
            group_data[key] = group[key]
            if key == '_id':
                group_data[key] = str(group[key])
        return jsonify(group_data)

    if request.method == 'PUT':
        # update group information
        return update_group_info(group, request)

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

    user = None
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