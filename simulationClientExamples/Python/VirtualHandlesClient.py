#!/bin/python2.7

"""
VirtualHandlesClient - Python implementation of a VirtualHandlesClient using Socket.IO
	
	Tim Claudius Stratmann - 2017
"""

#import json
from socketIO_client import SocketIO, LoggingNamespace

# default configuration
HOST = 'localhost'
PORT = 8080

def on_connect():
    print('connected to ' + HOST + ' on port ' + str(PORT))

def on_disconnect():
    print('disconnected')

def on_reconnect():
    print('reconnected')

def on_data_response(*args):
    #print('on_data_response', args) # json.dumps(args)
    print(str(args[0]['name']) + ' : ' + str(args[0]['value']))
    # TODO connect with OSC (lingain)
    if str(args[0]['name']) == 'machine-telegraph-left' or str(args[0]['name']) == 'machine-telegraph-right':
    	print('TODO: increase/decrease engine gain')
    	

socketIO = SocketIO(HOST, PORT, LoggingNamespace)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)
socketIO.on('reconnect', on_reconnect)

# listen
socketIO.on('data', on_data_response)

# test: set rudder to center
#socketIO.emit('data', {'name':'rudder', 'value': 0.0})

socketIO.wait() #wait forever, alternative: seconds=1

