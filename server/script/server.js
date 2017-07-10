#!/bin/node

/**
 * MATJES-UI
 * 
 * @file Server-Script
 * @author Uwe Gruenefeld, Tim Claudius Stratmann
 * @version 2016-02-24
 * 
 **/

// create objects
var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   conf = require('./config.json')
,	model = require('./model.json');

// bind port to server
server.listen(conf.port);

// static files
app.use(express.static('./../'));

// index file
app.get('/', function (req, res) {
	res.sendfile('./../index.html');
});

// data management
io.sockets.on('connection', function (socket) {

	// get of variable
	socket.on('data', function(data) {
	
		if(model.hasOwnProperty(data.name)) {
			
			// new value for variable
			if(data.hasOwnProperty('value')) {
			
				// update model
				model[data.name] = data.value;
				
				// update all sockets
				io.sockets.emit('data', { name : data.name, value : data.value } );
			
			// read value
			} else {
			
				// answer request
				socket.emit('data', { name : data.name, value : model[data.name] } );
			}
			
		} else {
			
			// update model
			model[data.name] = data.value;
		}
	});
});

// status
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(ifname + ':' + alias, iface.address);
	  console.log('The Server is running, access via http://'+iface.address +':'+ conf.port + '/');
    } else {
      // this interface has only one ipv4 adress
      //console.log(ifname, iface.address);
	  console.log('The Server is running, access via http://'+iface.address +':'+conf.port + '/');
    }
    ++alias;
  });
});
