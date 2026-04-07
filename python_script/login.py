from .authentication import *
from .UserObj import *
from config import config

def login_request(data):
    print(data)
    if(data["phone"] in config):
        return {"result":"success","name":config[data["phone"]]}
    return {"result":"fail"}