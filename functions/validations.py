import re


def validate_user_creation(values):
    print("entered user validation")
    user_regex = {
        'username': '^[a-zA-Z0-9\-]{4,12}$', #username regex
        'email': '^([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+$', # email regex
        'name': '^[a-zA-Z]{1,}$', # name regex
        'last_name': '^[a-zA-Z]{1,}$',
        'password': '^[a-zA-Z0-9]{8,}$' # password can be anything... but it has to be something
    }
    # checking if all fields have been checked
    for key in user_regex:
        if key not in values:
            return {'error': f'missing {key}'}

    for key, value in values.items():
        print(f'checking key {key}')
        if key != 'avatar':
            if key not in user_regex.keys():        
                    return {'error': f'{key} is not in user_regex'}
            # checking input value matches regex
            if not re.match(user_regex[key], value):
                    return {'error': f'{value} didnt mmatch {user_regex[key]}'}
    return True


def validate_group_creation(values):
    print("entered group validation")
    group_regex = {
        'groupname': '^[a-zA-Z0-9\-]{4,12}$', #groupname regex
        'description': '^[a-zA-Z0-9\-]{0,50}$', #description regex
    }
    
    return True


def validate_event_creation(values):
    """Validates the basic info for a new event"""
    event_regex = {
        'name': '^[a-zA-Z0-9\-]{4,12}$', #groupname regex
    }

    # checking if all fields have been checked
    for key in event_regex:
        if key not in values:
            return {'error': f'missing {key}'}
    
    for key, value in values.items():
        print(f'checking key {key}')
        if key == 'avatar':
            pass
        if key == 'latitude' or key == 'longitude':
            if values[key] > 180 or values[key] < -180:
                return {'error': f'{key} value must be between -180° and 180°'}
        if key not in event_regex.keys():
            return {'error': f'{key} is not in user_regex'}
        # checking input value matches regex
        if not re.match(event_regex[key], value):
                return {'error': f'{value} didnt mmatch {event_regex[key]}'}

    return True


def validate_add_user_event(values):
    return True