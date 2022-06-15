from app import *

def session_refresh():
    session['user'] = mongo.users.find_one({'_id': ObjectId(session['user_id'])})