from bson.objectid import ObjectId
from flask import Blueprint, render_template, session, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
from functions.validations import *
from werkzeug.security import generate_password_hash, check_password_hash
import json

api_views = Blueprint('api_views', __name__, template_folder='templates')


from api.views.groups import *
from api.views.events import *
from api.views.users import *
