var http = require('http');
var path = require('path');

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

const bcrypt = require('bcrypt');
const saltRounds = 10;


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
	/*var query = {'employeeId': {$in: [request.body.managerId, request.body.leadId, request.body.hrId]}};
	console.log(query);
	getUser(query);*/
	//console.log('internal', db.collection)
})



// register
const insertUser = function(user, cb) {

	bcrypt.hash(user.password, saltRounds, function(err, hash) {
		user.password = hash;  // Store hash in your password DB.

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
	 
	});

  
}

// login / reset password
var fetchUser = function(user,cb) {

	const collection = db.collection('user');
	console.log('user', user);

	// For reset password check
	if(user.oldPassword) {	
		user.password = user.oldPassword;
	}
	console.log('user.password', user.password)

	 collection.find({'employeeId': user.employeeId}).toArray(function(err, res) {
	 	console.log('err', res);
	 	if(err) {
	 		return cb(err);
	 	}
	 	if(res.length) {
	 		bcrypt.compare(user.password, res[0].password, function(error, response) {
	 		    console.log(error, response);

	 		    if(error) {
	 		    	return cb(error);
	 		    }
	 		    if (response) {
	 		    	return cb(err, res);
	 		    } else{
	 		    	return cb(err, {"passwordErr": true});
	 		    }
	 		});
	 	} else {
	 		return cb(null, {"usernameErr": true});
	 	}
	 	
	 })
}


var forgotPassword = function(obj, cb) {
	var query = {"employeeId": obj.employeeId};
	var fields = {};
	getUser(query, fields, function(err, res){
		if(err) {
			return cb(err);
		}

		return cb(err, res);


	})
}

var checkResetPasswordRequest = function(obj, cb) {
	fetchUser(obj, function(err, res){
		if(err) {
			return cb(err);
		}

		//console.log('checkResetPasswordRequest', res)

		return cb(null, res);
	})
}

var resetPassword = function(obj, cb) {
	bcrypt.hash(obj.password, saltRounds, function(err, hash) {

		// Get the documents collection
		const collection = db.collection('user');

		collection.updateOne({"employeeId": obj.employeeId}, {$set: {"password": hash}}, function(err, res){
			if(err) {
				return cb(err);
			}
			return cb(null, res);
		})
	});
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
	//console.log('obj', obj);
	collection.find(obj).toArray(function(err, res) {
		//console.log(err, res);
		return cb(err, res);
	})
}



// Update Leave Status
var updateLeaveStatus = function(obj, cb) {

	var collection = db.collection('leave-requests');

	var updateObj = {$set: {
		['status.' + obj.userType] :  obj.status
	}};



	collection.updateOne({"_id": ObjectId(obj._id)}, updateObj, function(err, res) {
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

var getUser = function(query, fields, cb) {
	var collection = db.collection('user');
	console.log(query, fields);
	collection.find(query, fields).toArray(function(err, res){
		if(err) {
			return cb(err);
		}

		return cb(err,res);
	})
}


var updateUser = function(obj, cb) {
	
	var collection = db.collection('user');

	collection.updateOne({'employeeId': obj.dbCheck}, {$set: obj.updatedObj}, function(err, res) {
		if(err) {
			return cb(err)
		}
		return cb(null, res);
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

app.post('/forgot-password', function(request, response){
	forgotPassword(request.body, function(err, res){
		if(err) {
			return response.send(err);
		}

		if(res.length) {
			console.log(res[0].employeeId);

			var forgotHtml = "<div> Hello<b>" + res[0].name  + "</b><br><div>We recieved a request to reset your account password. Click the button below to reset your password.</div><div><a href=http://localhost:4200/#/reset-password?employeeId=" +res[0].employeeId+ ">Click here to reset your password</a>";
			console.log("<a href='http://localhost:4200/#/reset-password?employeeId='" +res[0].employeeId+ ">Click here to reset your password</a>");

			sendEmail.sendEmail(res[0].email, "Reset password", forgotHtml);
			response.send({"userExist": true});
		} else {
			response.send({"userExist": false})
		}

	})	
})

app.post('/reset-password', function(request, response){
	checkResetPasswordRequest(request.body, function(err, res){
		console.log('res', res);
		if(res.length) {
			resetPassword(request.body, function(updateErr, updateResponse){
				if(updateErr) {
					response.send(updateErr);
				}
				console.log('updateResponse', updateResponse);
				var resetHtml = "<div> Hello <b> " +res[0].name+ "</b></div><div>Your password has updated successfully." 
				sendEmail.sendEmail(res[0].email, "Password updated", resetHtml);
				response.send({"passwordUpdate": true});
			});
		} else if(res.usernameErr) {
			response.send({"usernameErr": true})
		} else if(res.passwordErr) {
			response.send({"passwordErr": true})
		}
	})
})

app.post('/update-user', function(request, response) {
	updateUser(request.body, function(err, res){
		if(err) {
			response.send(err);
		}
		response.send(res);
	})
})

app.post('/register', function(request, response){
	insertUser(request.body, function(err, res){
		if(res.ok) {
			response.send(res);
		}
	});
})

app.post('/get-user-data', function(request, response){
	console.log(request.body);
	getUser(request.body.query, {'projection':request.body.fields}, function(err, res){
		console.log(res);

		if(res.length) {
			response.send(res);
		}
	})
})

app.post('/apply-leave', function(request, response){
	applyLeave(request.body, function(err, res){
		if(res.ok) {
			
			/*var query = {'employeeId': {$in: [request.body.manager.Id, request.body.leadId, request.body.hrId]}}
			var fields = {'projection': {'email': 1, _id:0}};
			;*/

			// for sending email
			if(request.body.lead) {
				var toEmails = request.body.manager.email+ ',' + request.body.hr.email + ',' + request.body.lead.email;
			} else {
				var toEmails = request.body.manager.email+ ',' + request.body.hr.email;
			}
			

			var html = "Hello " +request.body.employeeName+ "has applied for the leave";

			sendEmail.sendEmail(toEmails, "Leave Applied", html)
			
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
	//console.log(request.body);
	getEmpLeaveData(request.body, function(err, res){
		//console.log('result', res);
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
			var statusUpdaterName = "";

			switch(request.body.userType) {
				case "hr":
					updateLeaveCount(request.body);
					statusUpdaterName = request.body.hr.name;
					fireEmail(['employee', 'manager', 'lead'], request.body, statusUpdaterName);
					break;

				case "manager":
					statusUpdaterName = request.body.manager.name;
					fireEmail(['employee', 'hr', 'lead'], request.body, statusUpdaterName);
					break;

				case "lead":
					statusUpdaterName = request.body.lead.name;
					fireEmail(['employee', 'manager', 'hr'], request.body, statusUpdaterName);
					break;
			}

			response.send(res.result);
		}
	});
})

app.get('/get-all-employees', function(request, response){
	getUser({}, {}, function(err, res) {
		console.log(err, res);

		if(err) {
			response.send(err);
		}

		response.send(res);
	})
})

var fireEmail = function(recipientsArr, requestBody, statusUpdaterName){


	var employeeHtml = "<div>Hello <b> " +requestBody.employeeName+ "</b> </div><br> <div> Your leave request has " +requestBody.status+ "<b> " + statusUpdaterName + "</b></div>";

	var managerHtml = "<div>Hello <b>" +requestBody.manager.name+ "</b> </div> <br><div><b>" + statusUpdaterName + "</b> has "+requestBody.status+" the leave request of </div>" +requestBody.employeeName;

	var hrHtml = "<div>Hello <b>" +requestBody.hr.name+ " </b></div><br> <div><b>" + statusUpdaterName + "</b> has "+requestBody.status+" the leave request of </div>" +requestBody.employeeName;
	if(requestBody.lead) {
		var leadHtml = "<div>Hello <b>" +requestBody.lead.name+ " </b></div> <br><div><b>" + statusUpdaterName + "</b> has "+requestBody.status+" the leave request of </div>" +requestBody.employeeName;
	}
	

	console.log('employeeHtml', employeeHtml);
	console.log('managerHtml', managerHtml);
	console.log('leadHtml', leadHtml);
	console.log('hrHtml', hrHtml);

	for(i = 0 ; i<recipientsArr.length; i++) {
		switch(recipientsArr[i]) {
			case 'employee': 
				sendEmail.sendEmail(requestBody.employeeEmail, 'Leave' +requestBody.status, employeeHtml);
				break;

			case 'manager':
				sendEmail.sendEmail(requestBody.manager.email, 'Leave' +requestBody.status, managerHtml);
				break;

			case 'hr':
				sendEmail.sendEmail(requestBody.hr.email, 'Leave' +requestBody.status, hrHtml);
				break;

			case 'lead':
				if(requestBody.lead){
					sendEmail.sendEmail(requestBody.lead.email, 'Leave ' +requestBody.status, leadHtml);
				}
				break;
		}
	}
}


/*var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("", host, port);
});*/