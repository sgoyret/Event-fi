"""Validations of the collections"""
import re


def validate_user_creation(values):
    print("entered user validation")
    user_regex = {
        'username': '^[a-zA-Z0-9\-].{4,12}$', #username regex
        'email': '^([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z].{2,})+$', # email regex
        'name': '^[a-zA-Z].{1,20}$', # name regex
        'last_name': '^[a-zA-Z].{1,20}$',
        'password': '^[a-zA-Z0-9]+\W+$' # password can be anything... but it has to be something
    }

    for key, value in values.items():
        print(f'checking key {key}')
        if key != 'avatar':
            if key not in user_regex.keys():        
                    print(f'{key} is not in user_regex')
                    return False
            if not re.match(user_regex[key], value):
                    print(f'{value} didnt mmatch {user_regex[key]}')
                    return False

    return True