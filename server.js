var http = require('http');
var path = require('path');

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;


var sendEmail = require('./sendEmail');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

app.use(cors());
app.use(bodyParser.json());

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'learnNode';

// Create a new MongoClient
//const client = new MongoClient(url);


// Use connect method to connect to the Server
/*client.connect(function(err, database) {
  assert.equal(null, err);

  db = database;
  app.listen(8080);

  console.log('internal', db.collection)

});*/

MongoClient.connect(url, function(err, client){
	db = client.db(dbName);
	//client.close();
	app.listen(8080);
	//updateLeaveCount({"employeeId": "sqm-010", "leaveType":"CL", "leaveCount": 1});
	//console.log('internal', db.collection)
})




const insertUser = function(user, cb) {

  // Get the documents collection
  const collection = db.collection('user');
  // Insert some documents
  collection.insert([
    user
  ], function(err, result) {
   
    console.log("Inserted 3 documents into the collection",  result, err);
    //callback(result);

    return cb(err, result.result);
  });
}


var fetchUser = function(user,cb) {
	const collection = db.collection('user');
	console.log(user)
	 collection.find(user).toArray(function(err, res) {
	 	console.log(err, res);
	 	return cb(err, res);
	 })
}

var applyLeave = function(obj, cb){
	const collection = db.collection('leave-requests');

	collection.insert([obj],function(err, result){
		//console.log(err, result.result);
		return cb(err, result.result);
	})
}


// emp get own leave data
var getOwnLeaveData = function(obj, cb){
	const collection = db.collection('leave-requests');
	console.log(obj);
	collection.find(obj).toArray(function(err, res) {
		//console.log(err, res);
		return cb(err, res);
	})
}


// manager get emp leave data
var getEmpLeaveData = function(obj, cb){
	const collection = db.collection('leave-requests');
	console.log(obj);
	collection.find(obj).toArray(function(err, res) {
		//console.log(err, res);
		return cb(err, res);
	})
}



// Update Leave Status
var updateLeaveStatus = function(obj, cb) {

	var collection = db.collection('leave-requests');
	//console.log('obj._id', obj._id);

	collection.updateOne({"_id": ObjectId(obj._id)}, {$set: {"status": obj.status}}, function(err, res) {
		cb(err, res);
	})	
}




var updateLeaveCount = function(empObj) {
	var collection = db.collection('user');
	var query = {'employeeId': empObj.employeeId}

	collection.find(query).toArray(function(err, res){
		console.log('res', res);
		var updateObj = {};

		updateObj[empObj.leaveType] = res[0][empObj.leaveType] - empObj.leaveCount;
		collection.updateOne(query, {$set: updateObj});
	});
}

var getUser = function(query, cb) {
	var collection = db.collection('user');

	collection.find(query).toArray(function(err, res){
		if(err) {
			return cb(err);
		}

		return cb(err,res[0]);
	})
}



app.get('/', function(request, response){
	//console.log(db);
	response.sendFile(path.join(__dirname, '/package-lock.json'));
})

app.post('/login', function(request, response){
	//response.sendFile(path.join(__dirname, '/package-lock.json'));
	fetchUser(request.body, function(err,res){
		console.log(err,res)
		if(res) {
			response.send(res);
		}
	});
})

app.post('/register', function(request, response){
	insertUser(request.body, function(err, res){
		if(res.ok) {
			response.send(res);
		}
	});
})

app.post('/apply-leave', function(request, response){
	applyLeave(request.body, function(err, res){
		//console.log('result', res);
		if(res.ok) {
			getUser({'employeeId': request.body.managerId}, function(userErr, userRes){
				console.log(userRes.email);
				sendEmail.sendEmail(userRes.email, "Subject-Leave Applied", "Leave Applied");
			});
			
			response.send(res);
		}
	});	
})

app.post('/get-leave-data', function(request, response){
	console.log(request.body);
	getOwnLeaveData(request.body, function(err, res){
		console.log('result', res);
		if(err) {
			response.send(err);
		}

		response.send(res);
	});
})

app.post('/get-emp-leave-data', function(request, response){
	console.log(request.body);
	getEmpLeaveData(request.body, function(err, res){
		console.log('result', res);
		if(err) {
			response.send(err);
		}
		response.send(res);
	});
})

app.post('/update-leave-status', function(request, response){
	updateLeaveStatus(request.body, function(err, res){
		//console.log(err, res.result);
		if(err) {
			response.send(err);
		}

		if(res.result.ok) {
			if(request.body.status == "approved") {
				updateLeaveCount(request.body);
				var result = sendEmail.sendEmail(request.body.employeeEmail, "Subject-Leave Approved ", "Leave Approved");
			} else {
				console.log("Subject-Leave Denied")
				var result = sendEmail.sendEmail(request.body.employeeEmail, "Subject-Leave Denied ", "Leave Denied");
			}
			//console.log(result);
			response.send(res.result);
		}
	});
})


/*var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("", host, port);
});*/