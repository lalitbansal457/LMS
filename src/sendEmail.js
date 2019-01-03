var nodemailer = require('nodemailer');

export.sendEmail = function(to, subject, text) {
	return "abc";
	console.log("yippi");
	/*var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'lalit.bansal454@gmail.com',
	    pass: 'babubhudhu'
	  }
	});

	var mailOptions = {
	  from: 'youremail@gmail.com',
	  to: to,
	  subject: subject,
	  text: text
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);

	    return error;
	  } else {

	    console.log('Email sent: ' + info.response);

	    return info.response;
	  }
	});*/
} 